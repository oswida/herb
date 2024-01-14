use db::store::DocDb;
use net::{http::HttpServer, ws::WsServer};

mod db;
mod net;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().init();

    let doc_db = DocDb::new("herb-docs".to_string());

    let ws = WsServer::new();
    ws.run().await;

    let http = HttpServer::new();
    http.run().await;

    loop {}
}
