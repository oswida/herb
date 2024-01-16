use db::store::DocDb;
use net::ws::WsServer;

mod db;
mod net;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().init();

    let doc_db = DocDb::new("herb-docs".to_string());

    let ws = WsServer::new(5001);
    ws.run().await;

    loop {}
}
