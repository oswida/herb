use std::{collections::HashMap, sync::Arc};

use futures::{sink::SinkExt, stream::StreamExt};
use tokio::{
    spawn,
    sync::{Mutex, RwLock},
};

use tracing::debug;
use warp::{
    filters::ws::{WebSocket, Ws},
    Filter,
};
use y_sync::awareness::Awareness;
use yrs::Doc;
use yrs_warp::{
    ws::{WarpSink, WarpStream},
    BroadcastGroup,
};

#[derive(Clone)]
struct Room {
    pub room_id: String,
    pub doc: Doc,
    pub awareness: Arc<RwLock<Awareness>>,
    pub bcast: Arc<BroadcastGroup>,
}

#[derive(Clone)]
pub struct WsServer {
    port: u16,
    rooms: Arc<Mutex<HashMap<String, Room>>>,
}

impl WsServer {
    pub fn new(port: u16) -> Self {
        Self {
            rooms: Arc::new(Mutex::new(HashMap::new())),
            port,
        }
    }

    pub async fn run(self) {
        let ws = warp::path!("r" / String)
            .and(warp::ws())
            .and(warp::any().map(move || self.rooms.clone()))
            .map(
                |room_id: String, ws: Ws, rooms: Arc<Mutex<HashMap<String, Room>>>| {
                    let r = rooms.clone();
                    ws.on_upgrade(|socket| async move {
                        let mut room_map = r.lock().await;
                        if let None = room_map.get_mut(&room_id.clone()) {
                            let awareness = Arc::new(RwLock::new(Awareness::new(Doc::new())));
                            let bcast = Arc::new(BroadcastGroup::new(awareness.clone(), 32).await);
                            let data = Room { awareness, bcast };
                            debug!("Creating new room data {}", room_id);
                            room_map.insert(room_id.clone(), data);
                        };
                        if let Some(room) = room_map.get(&room_id) {
                            let (sink, stream) = socket.split();
                            let sink = Arc::new(Mutex::new(WarpSink::from(sink)));
                            let stream = WarpStream::from(stream);
                            debug!("Subscribing client to room changes ");
                            let sub = room.bcast.subscribe(sink, stream);
                            match sub.completed().await {
                                Ok(_) => println!("broadcasting for channel finished successfully"),
                                Err(e) => {
                                    eprintln!("broadcasting for channel finished abruptly: {}", e)
                                }
                            }
                        }
                    })
                },
            );
        let port = self.port.clone();
        spawn(async move {
            warp::serve(ws).run(([0, 0, 0, 0], port)).await;
        });
    }
}
