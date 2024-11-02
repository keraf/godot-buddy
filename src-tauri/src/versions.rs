/*
TODO:
- Get available versions
- Get installed versions

*/

use chrono::{NaiveDateTime, Utc};
use core::str;
use regex::Regex;
use std::{
    fs,
    io::Cursor,
    path::{Path, PathBuf},
    sync::Mutex,
};
use tauri::{AppHandle, Manager};
use tauri_plugin_http::reqwest;

use crate::{
    downloads,
    models::{Engine, Error, Release, Version},
    AppState,
};

static VERSIONS: &str = "https://raw.githubusercontent.com/godotengine/godot-website/refs/heads/master/_data/versions.yml";

pub async fn get_available_versions(app_handle: &AppHandle) -> Result<Vec<Version>, Error> {
    // Fetch versions online
    let res = match reqwest::get(VERSIONS).await {
        Ok(response) => response,
        Err(_) => return Err(Error::VersionsFetch),
    };

    let versions_content = match res.bytes().await {
        Ok(bytes) => bytes,
        Err(_) => return Err(Error::VersionsDecoding),
    };

    // TODO: Ensure app_data dir exists (create_dir_all on startup?)
    let app_dir = app_handle.path().app_data_dir().unwrap();
    let versions_path = app_dir.join("versions.yaml");
    fs::write(versions_path, versions_content.clone()).unwrap();

    let versions_content = str::from_utf8(&versions_content[..]).unwrap();
    let releases: Vec<Release> = serde_yml::from_str(versions_content).unwrap();

    let re_group = Regex::new(r#"([0-9]+.[0-9]+)(.[0-9]+){0,2}"#).unwrap();
    let mut versions: Vec<Version> = Vec::new();
    for release in releases {
        let group = match re_group.captures(&release.name.clone()) {
            Some(captures) => captures.get(1).unwrap().as_str().to_string(),
            None => release.name.clone(),
        };

        versions.push(Version {
            key: format!("{}-{}", release.name.clone(), release.flavor.clone()),
            name: release.name.clone(),
            flavor: release.flavor.clone(),
            group: group.clone(),
            release_date: release.release_date,
            release_notes: release.release_notes,
        });

        if let Some(sub_releases) = release.releases {
            for sub_release in sub_releases {
                versions.push(Version {
                    key: format!("{}-{}", release.name.clone(), sub_release.name.clone()),
                    name: release.name.clone(),
                    flavor: sub_release.name.clone(),
                    group: group.clone(),
                    release_date: sub_release.release_date,
                    release_notes: sub_release.release_notes,
                });
            }
        }
    }

    Ok(versions)
}

pub fn install_engine(
    app_handle: &AppHandle,
    path: PathBuf,
    key: String,
    version: String,
    flavor: String,
    dotnet: bool,
    install_path: String,
    release_date: NaiveDateTime,
) -> Engine {
    // Prepare directory for engine
    let engines_path = Path::new(&install_path);
    fs::create_dir_all(&engines_path).unwrap();

    // Extract engine archive
    let archive = fs::read(path.clone()).unwrap().to_vec();
    zip_extract::extract(Cursor::new(archive), &engines_path, true).unwrap();

    // Prepare engine info for saving
    let release_name: String =
        downloads::get_release_name(version.clone(), flavor.clone(), dotnet, true).unwrap();
    let engine_name = format!("Godot_v{}", release_name);
    let engine_path = engines_path.join(engine_name);
    let engine = Engine {
        key,
        path: engine_path.into_os_string().into_string().unwrap(),
        version,
        flavor,
        dotnet,
        release_date,
        last_used: Some(Utc::now().naive_utc()),
    };

    let state = app_handle.state::<Mutex<AppState>>();
    let mut state = state.lock().unwrap();
    state.engines.push(engine.clone());

    // Save engine info
    save_engine(&app_handle, state.engines.clone());

    engine
}

pub fn remove_engine(app_handle: &AppHandle, key: String) {
    let state = app_handle.state::<Mutex<AppState>>();
    let mut state = state.lock().unwrap();

    let path = state
        .engines
        .clone()
        .into_iter()
        .find(|p| p.key == key.clone())
        .unwrap()
        .path;
    let path = Path::new(&path).parent().unwrap();

    state.engines = state
        .engines
        .clone()
        .into_iter()
        .filter(|p| p.key != key.clone())
        .collect();

    save_engine(app_handle, state.engines.clone());
    fs::remove_dir_all(path).unwrap();
}

pub fn save_engine(app_handle: &AppHandle, engines: Vec<Engine>) {
    let engines_file = app_handle
        .path()
        .app_data_dir()
        .unwrap()
        .join("engines.json");

    let ser_engines = serde_json::to_string(&engines).unwrap();
    fs::write(engines_file, ser_engines).unwrap();
}

pub fn load_engines(app_handle: &AppHandle) -> Vec<Engine> {
    let engines_file = app_handle
        .path()
        .app_data_dir()
        .unwrap()
        .join("engines.json");

    if !engines_file.exists() {
        return Vec::new();
    }

    let engines_content = fs::read_to_string(engines_file).unwrap();
    let engines: Vec<Engine> = serde_json::from_str(&engines_content).unwrap();

    engines
}
