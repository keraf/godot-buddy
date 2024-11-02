// RSS:
/*
TODO:
- Get RSS feed
- Save last viewed
- Store news and images to local cache
*/

use std::fs;

use crate::models::{Error, NewsItem};
use spex::parsing::XmlReader;
use tauri::{AppHandle, Manager};
use tauri_plugin_http::reqwest;

static RSS: &str = "https://godotengine.org/rss.xml";

pub async fn get_news_feed(app_handle: &AppHandle) -> Result<Vec<NewsItem>, Error> {
    match fetch_news(app_handle).await {
        Ok(online_news) => {
            // TODO: Update last seen value
            // TODO: Only cache feed if new
            Ok(online_news)
        }
        Err(_) => get_cached_feed(app_handle),
    }
}

pub async fn fetch_news(app_handle: &AppHandle) -> Result<Vec<NewsItem>, Error> {
    let res = match reqwest::get(RSS).await {
        Ok(response) => response,
        Err(_) => return Err(Error::NewsFeedFetch),
    };

    let content = res.bytes().await.unwrap();
    let xml_doc = XmlReader::parse_auto(&content[..]).unwrap();
    let news_items = xml_doc
        .root()
        .first("channel")
        .all("item")
        .iter()
        .map(|item| NewsItem {
            id: item.req("guid").text().unwrap().to_string(),
            title: item.req("title").text().unwrap().to_string(),
            link: item.req("link").text().unwrap().to_string(),
            description: item.req("description").text().unwrap().to_string(),
            category: item.req("category").text().unwrap().to_string(),
            creator: item
                .pre_ns("http://purl.org/dc/elements/1.1/")
                .req("creator")
                .text()
                .unwrap()
                .to_string(),
            image: item.req("image").text().unwrap().to_string(),
            pub_date: item.req("pubDate").text().unwrap().to_string(),
        })
        .collect();

    // Cache result
    let app_data = app_handle.path().app_data_dir().unwrap();
    fs::create_dir_all(&app_data).unwrap();

    let news_content = serde_json::to_string(&news_items).unwrap();
    let news_path = app_data.join("news.json");
    fs::write(news_path, news_content).unwrap();

    Ok(news_items)
}

pub async fn get_news_image(app_handle: &AppHandle, url: String) -> String {
    let cache_dir = app_handle
        .path()
        .app_data_dir()
        .unwrap()
        .join("image-cache");
    fs::create_dir_all(&cache_dir).unwrap();

    let image_name = url.split("/").last().unwrap().to_string();
    let image_path = cache_dir.join(&image_name);

    if !image_path.exists() {
        // Download image & write it
        let res = reqwest::get(url).await.unwrap();
        let content = res.bytes().await.unwrap();
        fs::write(&image_path, content).unwrap();
    }

    image_name
}

pub fn get_cached_feed(app_handle: &AppHandle) -> Result<Vec<NewsItem>, Error> {
    let app_data = app_handle.path().app_data_dir().unwrap();
    fs::create_dir_all(&app_data).unwrap();

    let news_path = app_data.join("news.json");
    if !news_path.exists() {
        return Err(Error::NewsFeedDoesntExist);
    }

    let news_content = fs::read_to_string(news_path).unwrap();
    let news_items: Vec<NewsItem> = serde_json::from_str(&news_content).unwrap();

    Ok(news_items)
}
