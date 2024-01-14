use std::{collections::HashMap, sync::Arc};

use futures_util::stream::StreamExt;
use tokio::{
    spawn,
    sync::{Mutex, RwLock},
};

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
struct RoomData {
    pub awareness: Arc<RwLock<Awareness>>,
    pub bcast: Arc<BroadcastGroup>,
}

#[derive(Clone)]
pub struct WsServer {
    rooms: Arc<Mutex<HashMap<String, RoomData>>>,
}

impl WsServer {
    pub fn new() -> Self {
        Self {
            rooms: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn run(self) {
        let ws = warp::path!("r" / String)
            .and(warp::ws())
            .and(warp::any().map(move || self.rooms.clone()))
            .map(
                |room_id: String, ws: Ws, rooms: Arc<Mutex<HashMap<String, RoomData>>>| {
                    let r = rooms.clone();
                    ws.on_upgrade(|socket| async move {
                        let mut room_map = r.lock().await;
                        if let None = room_map.get_mut(&room_id.clone()) {
                            let awareness = Arc::new(RwLock::new(Awareness::new(Doc::new())));
                            let bcast = Arc::new(BroadcastGroup::new(awareness.clone(), 32).await);
                            let data = RoomData { awareness, bcast };
                            room_map.insert(room_id.clone(), data);
                        };
                        if let Some(room) = room_map.get(&room_id) {
                            let (sink, stream) = socket.split();
                            let sink = Arc::new(Mutex::new(WarpSink::from(sink)));
                            let stream = WarpStream::from(stream);
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
        spawn(async move {
            warp::serve(ws).run(([127, 0, 0, 1], 8000)).await;
        });
    }

    // async fn ws_handler(self,room_id: String, ws: Ws) -> Result<impl Reply, Rejection> {
    //     Ok(ws.on_upgrade(move |socket| self.peer(room_id, socket)))
    // }

    // async fn peer(self, _room_id: String, ws: WebSocket) {
    //     // We're using a single static document shared among all the peers.
    //     let awareness = Arc::new(RwLock::new(Awareness::new(Doc::new())));

    //     // open a broadcast group that listens to awareness and document updates
    //     // and has a pending message buffer of up to 32 updates
    //     let bcast = Arc::new(BroadcastGroup::new(awareness, 32).await);

    //     let (sink, stream) = ws.split();
    //     let sink = Arc::new(Mutex::new(WarpSink::from(sink)));
    //     let stream = WarpStream::from(stream);
    //     let sub = bcast.subscribe(sink, stream);
    //     match sub.completed().await {
    //         Ok(_) => println!("broadcasting for channel finished successfully"),
    //         Err(e) => eprintln!("broadcasting for channel finished abruptly: {}", e),
    //     }
    // }
}
