use std::{collections::HashMap, fs};

use tauri::{AppHandle, Manager};

pub fn load_settings(app_handle: &AppHandle) -> HashMap<String, String> {
    let app_data = app_handle.path().app_data_dir().unwrap();
    fs::create_dir_all(&app_data).unwrap();

    let settings_file = app_data.join("settings.json");
    if !settings_file.exists() {
        fs::write(settings_file.clone(), "{}").unwrap();
    }

    // Read file
    let settings_content = fs::read_to_string(settings_file.clone()).unwrap();
    let mut settings: HashMap<String, String> = serde_json::from_str(&settings_content).unwrap();

    // Keep track of current settings length, we're checking if new defaults have been added later
    let key_count = settings.len().clone();

    // Default settings
    if settings.get("projectDoubleClickAction").is_none() {
        settings.insert("projectDoubleClickAction".to_string(), "edit".to_string());
    }

    if settings.get("engineDefaultInstallPath").is_none() {
        settings.insert(
            "engineDefaultInstallPath".to_string(),
            app_data.join("engines").to_str().unwrap().to_string(),
        );
    }

    // Save if some new defaults have been added
    if key_count != settings.len() {
        save_settings(app_handle, settings.clone());
    }

    settings
}

pub fn save_settings(app_handle: &AppHandle, settings: HashMap<String, String>) {
    let app_data = app_handle.path().app_data_dir().unwrap();
    fs::create_dir_all(&app_data).unwrap();

    let settings_file = app_data.join("settings.json");
    let settings_content = serde_json::to_string(&settings).unwrap();
    fs::write(settings_file, settings_content).unwrap();
}
