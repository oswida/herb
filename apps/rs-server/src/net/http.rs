use axum::{
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone)]
pub struct HttpServer {}

impl HttpServer {
    pub fn new() -> Self {
        Self {}
    }

    pub async fn run(self) {
        let app = Router::new().route("/", get(root));
        let listener = tokio::net::TcpListener::bind("0.0.0.0:5001").await.unwrap();
        axum::serve(listener, app).await.unwrap();
    }
}

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello, World!"
}
