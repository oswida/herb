use lmdb_rs::core::DbCreate;
use lmdb_rs::{DbHandle, Environment};
use std::sync::Arc;
use yrs::Doc;
use yrs_kvstore::DocOps;
use yrs_lmdb::LmdbStore;

pub struct DocDb {
    dir: String,
    handle: Arc<DbHandle>,
    env: Arc<Environment>,
}

impl DocDb {
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

    pub fn get_doc(&self, room_id: String) -> Option<Doc> {
        let txn = self.env.new_transaction().unwrap();
        let doc_name = format!("doc_{}", room_id);
        let db = LmdbStore::from(txn.bind(&self.handle));
        db.
        let r = db.get(&doc_name);
        txn.commit().unwrap();
        match r {
            Ok(doc) => Ok(doc),
            Err(_) => todo!(),
        }
    }

    pub fn observe_doc(self, doc: Doc, room_id: String) {
        let doc_name = format!("doc_{}", room_id);
        let _sub = {
            let env = self.env.clone();
            let handle = self.handle.clone();
            doc.observe_update_v1(move |_, e| {
                let txn = env.new_transaction().unwrap();
                let db = LmdbStore::from(txn.bind(&handle));
                let i = db.push_update(&doc_name, &e.update).unwrap();
                if i % 128 == 0 {
                    // compact updates into document
                    db.flush_doc(&doc_name).unwrap();
                }
                txn.commit().unwrap();
            })
            .unwrap()
        };
    }
}
