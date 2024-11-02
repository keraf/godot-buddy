use chrono::Utc;
use regex::Regex;
use std::sync::Mutex;
use std::{
    fs,
    path::{Path, PathBuf},
};
use tauri::{AppHandle, Manager};
use tauri_plugin_shell::ShellExt;

use crate::{
    models::{Error, Project, ProjectInfo},
    AppState,
};

pub fn add_project(
    app_handle: &AppHandle,
    path: String,
    engine_use: String,
) -> Result<Project, Error> {
    let project_dir = Path::new(&path);
    if !project_dir.exists() {
        return Err(Error::ProjectFolderDoesntExist);
    }

    let project_file = project_dir.join("project.godot");
    if !project_file.exists() {
        return Err(Error::ProjectFolderIsNotGodot);
    }

    let info = get_project_info(project_file)?;

    let state = app_handle.state::<Mutex<AppState>>();
    let mut state = state.lock().unwrap();

    // Check if project already exists
    if state
        .projects
        .clone()
        .into_iter()
        .filter(|p| p.path == info.path)
        .count()
        > 0
    {
        return Err(Error::ProjectAlreadyAdded);
    }

    let project = Project {
        name: info.name,
        path,
        icon: info.icon,
        favorite: false,
        dotnet: info.dotnet,
        last_opened: Utc::now().naive_utc(),
        engine_version: info.version,
        engine_use,
    };

    // Add project to state
    state.projects.push(project.clone());

    // Save project
    save_projects(app_handle, state.projects.clone());

    Ok(project)
}

pub fn remove_project(app_handle: &AppHandle, path: String, delete: bool) {
    let state = app_handle.state::<Mutex<AppState>>();
    let mut state = state.lock().unwrap();

    state.projects = state
        .projects
        .clone()
        .into_iter()
        .filter(|p| p.path != path)
        .collect();

    save_projects(app_handle, state.projects.clone());

    if delete {
        fs::remove_dir_all(path).unwrap();
    }
}

pub fn load_projects(app_handle: &AppHandle) -> Vec<Project> {
    let app_dir = app_handle.path().app_data_dir().unwrap();
    let projects_file = app_dir.join("projects.json");

    // Read file
    if !projects_file.exists() {
        return Vec::new();
    }

    let projects_content = fs::read_to_string(projects_file).unwrap();
    let projects: Vec<Project> = serde_json::from_str(&projects_content).unwrap();

    projects
}

pub fn save_projects(app_handle: &AppHandle, projects: Vec<Project>) -> Vec<Project> {
    let app_dir = app_handle.path().app_data_dir().unwrap();
    let projects_file = app_dir.join("projects.json");
    let projects_content = serde_json::to_string(&projects).unwrap();
    fs::write(projects_file, projects_content).unwrap();

    projects
}

pub fn get_project_info(godot_file: PathBuf) -> Result<ProjectInfo, Error> {
    let project_content = fs::read_to_string(&godot_file).unwrap();

    // Get configuration file version (this will help determine the version of Godot)
    let re_config: Regex = Regex::new(r"config_version=([0-9+])\n").unwrap();
    let config_version: i8 = match re_config.captures(&project_content) {
        Some(captures) => captures.get(1).unwrap().as_str().parse::<i8>().unwrap(),
        None => return Err(Error::ProjectInvalidFile),
    };

    // If the config file is below 5, we'll just assume it's Godot 3.x (we don't support < 3.x)
    let version = if config_version < 5 {
        "3.x".to_string()
    } else {
        let re_version: Regex = Regex::new(
            r#"config/features=PackedStringArray\((?:"(?:([0-9].[0-9]+)|[A-Za-z #]+)"(?:,\s)?)+\)\n"#,
        )
        .unwrap();

        match re_version.captures(&project_content) {
            Some(captures) => captures.get(1).unwrap().as_str().to_string(),
            None => "4.x".to_string(),
        }
    };

    let dotnet = if config_version < 5 {
        // TODO: Search inside the folder for .cs files or .sln
        false
    } else {
        let re_dotnet: Regex = Regex::new(
            r#"config/features=PackedStringArray\([A-Za-z0-9.#,\s"]+C#[A-Za-z0-9.#,\s"]+\)\n"#,
        )
        .unwrap();
        re_dotnet.is_match(&project_content)
    };

    let re_name: Regex = Regex::new(r#"config/name="(.*)"\n"#).unwrap();
    let name = match re_name.captures(&project_content) {
        Some(captures) => captures.get(1).unwrap().as_str().to_string(),
        None => "".to_string(),
    };

    let re_icon: Regex = Regex::new(r#"config/icon="(.*)"\n"#).unwrap();
    let icon = match re_icon.captures(&project_content) {
        Some(captures) => captures.get(1).unwrap().as_str().to_string(),
        None => "".to_string(),
    };

    let project_path = godot_file.parent().unwrap();
    let icon_path = project_path.join(icon.replace("res://", ""));

    Ok(ProjectInfo {
        name,
        path: project_path.to_str().unwrap().to_string(),
        icon: icon_path.to_str().unwrap().to_string(),
        version,
        dotnet,
    })
}

pub fn open_project(app_handle: &AppHandle, path: String, editor: bool) -> Result<(), Error> {
    let state = app_handle.state::<Mutex<AppState>>();
    let mut state = state.lock().unwrap();

    let project = state
        .projects
        .clone()
        .into_iter()
        .find(|p| p.path == path)
        .unwrap();

    // Update last run property
    state.projects = state
        .projects
        .clone()
        .into_iter()
        .map(|p| {
            if p.path != path {
                return p;
            }

            let mut p = p;
            p.last_opened = Utc::now().naive_utc();
            p
        })
        .collect();

    let engine = state
        .engines
        .clone()
        .into_iter()
        .find(|e| e.key == project.engine_use);

    if engine.is_none() {
        return Err(Error::EngineNotFound);
    }

    // Update last run property
    state.engines = state
        .engines
        .clone()
        .into_iter()
        .map(|e| {
            if e.key != project.engine_use {
                return e;
            }

            let mut e = e;
            e.last_used = Some(Utc::now().naive_utc());
            e
        })
        .collect();

    let engine = engine.unwrap();
    let shell = app_handle.shell();
    let mut program = shell.command(engine.path).arg("--path").arg(project.path);

    if editor {
        program = program.arg("--editor");
    }

    program.spawn().unwrap();
    Ok(())
}
