use lmdb_rs::core::DbCreate;
use lmdb_rs::{DbHandle, Environment};
use std::sync::Arc;
use yrs_kvstore::DocOps;
use yrs_lmdb::LmdbStore;

use super::error::DbError;

pub struct RoomDb {
    dir: String,
    handle: Arc<DbHandle>,
    env: Arc<Environment>,
}

#[derive(Clone)]
pub struct RoomData {
    room_id: String,
    name: String,
    owner: String,
}

impl RoomDb {
    pub fn new(dir: String) -> Self {
        let env = Environment::new()
            .autocreate_dir(true)
            .map_size(256 * 1024 * 1024)
            .max_dbs(1)
            .open(dir.clone(), 0o777)
            .unwrap();
        let env = Arc::new(env);
        let handle = Arc::new(env.create_db(&dir, DbCreate).unwrap());

        Self {
            dir: dir.to_string(),
            handle,
            env,
        }
    }

    pub fn find_room(&self, room_id: String) -> Result<RoomData, DbError> {
        Err(DbError::RoomNotFound(room_id))
    }
}
