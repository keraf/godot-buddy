use chrono::naive::serde::{ts_milliseconds, ts_milliseconds_option, ts_seconds};
use chrono::{DateTime, NaiveDateTime};
use serde::{de, Deserialize, Deserializer, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub enum Error {
    NewsFeedFetch,
    NewsFeedDecoding,
    NewsFeedParsing,
    NewsFeedDoesntExist,
    ProjectFolderDoesntExist,
    ProjectFolderIsNotGodot,
    ProjectAlreadyAdded,
    ProjectUnsupportedGodot,
    ProjectInvalidFile,
    VersionsFetch,
    VersionsDecoding,
    ReleaseApiFetch,
    PlatformNameNotFound,
    BuildNotFound,
    EngineNotFound,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub struct NewsFeed {
    pub online: bool,
    pub items: Vec<NewsItem>,
    #[serde(with = "ts_seconds")]
    #[ts(type = "number")]
    pub last_checked: NaiveDateTime,
    #[serde(with = "ts_seconds")]
    #[ts(type = "number")]
    pub last_update: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub struct NewsItem {
    pub id: String,
    pub title: String,
    pub link: String,
    pub description: String,
    pub category: String,
    pub creator: String,
    pub image: String,
    pub pub_date: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub struct Project {
    pub name: String,
    pub path: String,
    pub icon: String,
    pub favorite: bool,
    pub dotnet: bool,
    #[serde(with = "ts_seconds")]
    #[ts(type = "number")]
    pub last_opened: NaiveDateTime,
    pub engine_version: String, // Engine version from the project
    pub engine_use: String,     // Engine version to use (can differ from the project one)
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub struct ProjectInfo {
    pub name: String,
    pub path: String,
    pub dotnet: bool,
    pub version: String,
    pub icon: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub struct Engine {
    pub key: String,     // Index key for the engine (version-flavor-mono/std)
    pub version: String, // Engine version
    pub flavor: String,  // Is stable version
    pub dotnet: bool,    // Is C# build
    pub path: String,    // Installation path (if the engine is installed)
    // pub default: bool,   // Is default engine
    #[serde(with = "ts_milliseconds")]
    #[ts(type = "number")]
    pub release_date: NaiveDateTime, // Release date of that version
    #[serde(with = "ts_milliseconds_option")]
    #[ts(type = "number")]
    pub last_used: Option<NaiveDateTime>, // Last time it was used
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub struct DownloadStart {
    pub key: String,
    pub total_size: usize,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub struct DownloadProgress {
    pub key: String,
    pub downloaded: usize,
    pub speed: usize,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub struct DownloadFinished {
    pub key: String,
}

//

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../../src/tauri.d.ts")]
pub struct Version {
    pub key: String,
    pub name: String,
    pub flavor: String,
    pub group: String,
    pub release_date: String,
    pub release_notes: String,
}

/**
 * Versions file (from Godot)
 */
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Release {
    pub name: String,
    pub flavor: String,
    pub release_date: String,
    pub release_notes: String,
    pub releases: Option<Vec<SubRelease>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SubRelease {
    pub name: String,
    pub release_date: String,
    pub release_notes: String,
}

/**
 * Github API responses (partial)
 */
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GithubRelease {
    pub tag_name: String,
    pub name: String,
    pub draft: bool,
    pub prerelease: bool,
    #[serde(deserialize_with = "datetime_from_str")]
    pub created_at: NaiveDateTime,
    #[serde(deserialize_with = "datetime_from_str")]
    pub published_at: NaiveDateTime,
    pub assets: Vec<GithubAsset>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GithubAsset {
    pub name: String,
    pub content_type: String,
    pub size: usize,
    #[serde(deserialize_with = "datetime_from_str")]
    pub created_at: NaiveDateTime,
    #[serde(deserialize_with = "datetime_from_str")]
    pub updated_at: NaiveDateTime,
    pub browser_download_url: String,
}

fn datetime_from_str<'de, D>(deserializer: D) -> Result<NaiveDateTime, D::Error>
where
    D: Deserializer<'de>,
{
    let s: String = Deserialize::deserialize(deserializer)?;
    Ok(DateTime::parse_from_rfc3339(&s)
        .map_err(de::Error::custom)?
        .naive_utc())
}
