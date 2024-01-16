use core::fmt;

use super::room;

#[derive(Debug, Clone)]
pub enum DbError {
    UserNotFound(String),
    RoomNotFound(String),
}

impl fmt::Display for DbError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            DbError::UserNotFound(username) => write!(f, "User {} not found", username),
            DbError::RoomNotFound(room_id) => write!(f, "Room {} not found", room_id),
        }
    }
}
