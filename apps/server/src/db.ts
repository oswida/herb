import { Level } from "level";

export const DB_PATH = "./hdata";

export const initDb = () => {
  const database = new Level<string, object>(DB_PATH, {
    valueEncoding: "json",
  });
  database
    .open()
    .then(() => {
      console.log("Database opened");
    })
    .catch((err) => {
      console.error(err);
    });
  return database;
};

export const closeDb = (database: Level<string, object>) => {
  database
    .close()
    .then(() => {
      // console.log("Database closed");
    })
    .catch((err) => {
      console.error(err);
    });
};
