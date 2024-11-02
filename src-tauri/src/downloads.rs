use std::{
    cmp::min,
    fs::{self, File},
    io::Write,
};

use crate::{
    models::{DownloadFinished, DownloadProgress, DownloadStart, Error, GithubRelease},
    versions,
};
use chrono::NaiveDateTime;
use futures_util::StreamExt;
use tauri::{http::header::USER_AGENT, AppHandle, Emitter, Manager};
use tauri_plugin_http::reqwest;

static GH_BUILD_REPO_API: &str = "https://api.github.com/repos/godotengine/godot-builds/releases";

pub async fn start_download(
    app_handle: &AppHandle,
    version: String,
    flavor: String,
    dotnet: bool,
    path: String,
) {
    let (link, release_date) = get_release_link(version.clone(), flavor.clone(), dotnet)
        .await
        .unwrap();

    let res = reqwest::get(link.clone()).await.unwrap();
    let total_size: usize = res.content_length().unwrap() as usize;
    let file_name = link.split("/").last().unwrap();
    let cache_dir = app_handle.path().app_cache_dir().unwrap();
    fs::create_dir_all(&cache_dir).unwrap();

    let build_type = if dotnet { "mono" } else { "std" }.to_string();
    let key = vec![version.clone(), flavor.clone(), build_type].join("-");
    let file_path = cache_dir.join(file_name);
    let mut file = File::create(file_path.clone()).unwrap();
    let mut downloaded: usize = 0;
    let mut stream = res.bytes_stream();

    app_handle
        .emit(
            "download-start",
            DownloadStart {
                key: key.clone(),
                total_size: total_size.clone(),
            },
        )
        .unwrap();

    while let Some(item) = stream.next().await {
        let chunk = item.unwrap();
        file.write_all(&chunk).unwrap();
        downloaded = min(downloaded + chunk.len(), total_size);

        app_handle
            .emit(
                "download-progress",
                DownloadProgress {
                    key: key.clone(),
                    downloaded,
                    speed: 0,
                },
            )
            .unwrap();
    }

    app_handle
        .emit("download-finished", DownloadFinished { key: key.clone() })
        .unwrap();

    let engine = versions::install_engine(
        &app_handle,
        file_path.clone(),
        key,
        version,
        flavor,
        dotnet,
        path,
        release_date,
    );

    app_handle.emit("engine-installed", engine).unwrap();
}

// TODO: Make pausable/resumable downloads
// pub fn pause_download() {}
// pub fn resume_download() {}
// pub fn cancel_download() {}

pub fn get_release_name(
    version: String,
    flavor: String,
    dotnet: bool,
    exe: bool,
) -> Result<String, Error> {
    let platform = get_platform_name(if exe { false } else { dotnet });

    if platform == "" {
        return Err(Error::PlatformNameNotFound);
    }

    let tag = format!("{}-{}", version, flavor);
    let release_name = if dotnet {
        format!("{}_mono_{}", tag, platform)
    } else {
        format!("{}_{}", tag, platform)
    };

    Ok(release_name)
}

pub async fn get_release_link(
    version: String,
    flavor: String,
    dotnet: bool,
) -> Result<(String, NaiveDateTime), Error> {
    let tag = format!("{}-{}", version, flavor);
    let build_info = get_github_release(tag.clone()).await?;
    let release_name = get_release_name(version, flavor, dotnet, false)?;

    let release = build_info
        .assets
        .iter()
        .find(|&asset| asset.browser_download_url.contains(&release_name));

    if release.is_none() {
        return Err(Error::BuildNotFound);
    }

    let release = release.unwrap();

    Ok((
        release.browser_download_url.clone(),
        release.created_at.clone(),
    ))
}

pub async fn get_github_release(tag: String) -> Result<GithubRelease, Error> {
    let url = format!("{}/tags/{}", GH_BUILD_REPO_API, tag);
    // TODO: Make this client reusable
    let client = reqwest::Client::new();
    let res = match client
        .get(url)
        .header(USER_AGENT, "GodotBuddy/0.1.0") // TODO: Set version
        .send()
        .await
    {
        Ok(response) => response,
        Err(_) => return Err(Error::ReleaseApiFetch),
    };

    let body = res.text().await.unwrap();
    let build_info: GithubRelease = serde_json::from_str(&body).unwrap();

    Ok(build_info)
}

pub fn get_platform_name(dotnet: bool) -> String {
    let platform = tauri_plugin_os::platform();
    let arch = tauri_plugin_os::arch();

    if platform == "macos" {
        return "macos.universal".to_string();
    }

    if platform == "windows" {
        return match arch {
            "x86_64" => "win64",
            "x86" => "win32",
            "aarch64" => "windows_arm64",
            _ => "",
        }
        .to_string();
    }

    // Linux .NET builds have a different naming (only for archive, not executable)
    if dotnet {
        return match arch {
            "x86_64" => "linux_x86_64",
            "x86" => "linux_x86_32",
            "arm" => "linux_arm32",
            "aarch64" => "linux_arm64",
            _ => "",
        }
        .to_string();
    }

    match arch {
        "x86_64" => "linux.x86_64",
        "x86" => "linux.x86_32",
        "arm" => "linux.arm32",
        "aarch64" => "linux.arm64",
        _ => "",
    }
    .to_string()
}
