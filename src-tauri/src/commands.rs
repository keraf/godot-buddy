use std::{collections::HashMap, path::Path, sync::Mutex};

use tauri::{AppHandle, Manager};

use crate::{
    downloads,
    models::{Engine, Error, NewsItem, Project, ProjectInfo, Version},
    news, projects, settings, versions, AppState,
};

/**
 * Projects
 */
#[tauri::command]
pub fn projects_get(app_handle: AppHandle) -> Vec<Project> {
    let state = app_handle.state::<Mutex<AppState>>();
    let state = state.lock().unwrap();
    state.projects.clone()
}

#[tauri::command]
pub fn projects_get_info(path: String) -> Result<ProjectInfo, Error> {
    projects::get_project_info(Path::new(&path).to_path_buf())
}

#[tauri::command]
pub async fn projects_add(
    app_handle: AppHandle,
    path: String,
    engine_run: String,
) -> Result<Project, Error> {
    projects::add_project(&app_handle, path, engine_run)
}

#[tauri::command]
pub fn projects_remove(app_handle: AppHandle, path: String, delete: bool) {
    projects::remove_project(&app_handle, path, delete)
}

/*
#[tauri::command]
pub fn projects_create_shortcut(app_handle: AppHandle, path: String) {
    todo!()
}

#[tauri::command]
pub fn projects_set_engine_version(app_handle: AppHandle, path: String, version: String) {
    todo!()
}
*/

#[tauri::command]
pub fn projects_edit(app_handle: AppHandle, path: String) -> Result<(), Error> {
    projects::open_project(&app_handle, path, true)
}

#[tauri::command]
pub fn projects_run(app_handle: AppHandle, path: String) -> Result<(), Error> {
    projects::open_project(&app_handle, path, false)
}

/**
 * Versions
 */
#[tauri::command]
pub async fn versions_get_available(app_handle: AppHandle) -> Result<Vec<Version>, Error> {
    versions::get_available_versions(&app_handle).await
}

#[tauri::command]
pub fn versions_get_installed(app_handle: AppHandle) -> Vec<Engine> {
    let state = app_handle.state::<Mutex<AppState>>();
    let state = state.lock().unwrap();
    state.engines.clone()
}

#[tauri::command]
pub fn versions_remove_engine(app_handle: AppHandle, key: String) {
    versions::remove_engine(&app_handle, key);
}

/**
 * Downloads
 */
#[tauri::command]
pub async fn download_start(
    app_handle: AppHandle,
    version: String,
    flavor: String,
    dotnet: bool,
    path: String,
) {
    downloads::start_download(&app_handle, version, flavor, dotnet, path).await;
}

/**
 * News
 */
#[tauri::command]
pub async fn news_get(app_handle: AppHandle) -> Result<Vec<NewsItem>, Error> {
    news::get_news_feed(&app_handle).await
}

#[tauri::command]
pub async fn news_get_image(app_handle: AppHandle, url: String) -> String {
    news::get_news_image(&app_handle, url).await
}

/**
 * Settings
 */
#[tauri::command]
pub fn settings_get(app_handle: AppHandle) -> HashMap<String, String> {
    let state = app_handle.state::<Mutex<AppState>>();
    let state = state.lock().unwrap();
    state.settings.clone()
}

#[tauri::command]
pub fn settings_set(app_handle: AppHandle, settings: HashMap<String, String>) {
    let state = app_handle.state::<Mutex<AppState>>();
    let mut state = state.lock().unwrap();
    state.settings = settings.clone();

    settings::save_settings(&app_handle, settings);
}
