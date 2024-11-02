// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, sync::Mutex};

use models::{Engine, Project};
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;

mod commands;
mod downloads;
mod models;
mod news;
mod projects;
mod settings;
mod versions;

#[derive(Default)]
struct AppState {
    projects: Vec<Project>,
    engines: Vec<Engine>,
    settings: HashMap<String, String>,
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            // TODO: Check if it contains params for shortcut
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            // app.emit("single-instance", Payload { args: argv, cwd }).unwrap();
        }))
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--autostart"]),
        ))
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            let mut state = AppState::default();

            // Load settings
            let settings = settings::load_settings(app.app_handle());
            state.settings = settings.clone();

            // Load projects
            let projects = projects::load_projects(app.app_handle());
            state.projects = projects.clone();

            // Load engines
            let engines = versions::load_engines(app.app_handle());
            state.engines = engines.clone();

            app.manage(Mutex::new(state));

            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::projects_get,
            commands::projects_get_info,
            commands::projects_add,
            commands::projects_remove,
            // commands::projects_create_shortcut,
            // commands::projects_set_engine_version,
            commands::projects_edit,
            commands::projects_run,
            commands::versions_get_available,
            commands::versions_get_installed,
            commands::versions_remove_engine,
            commands::download_start,
            commands::news_get,
            commands::news_get_image,
            commands::settings_get,
            commands::settings_set,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
