/* eslint-disable import/no-extraneous-dependencies -- comment */

import type { IncomingMessage, ServerResponse } from "node:http";
import { Level } from "level";

interface RoomData {
  owner: string;
  id: string;
  secure: boolean;
  allowedUsers: string[];
  blockedUsers: string[];
}

export const useDb = () => {
  const DB_PATH = "./hdata";

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

  const processRoom = async (
    request: IncomingMessage,
    response: ServerResponse & {
      req: IncomingMessage;
    }
  ) => {
    if (!request.url?.startsWith("/api/room") || request.method === undefined)
      return false;
    const parts = request.url.split("/");
    if (parts.length < 5) return false;
    const roomId = parts[3];
    const user = parts[4];

    if (!roomId || !user) {
      return false;
    }

    if (request.method.toLowerCase() === "get") {
      try {
        const value = await database.get(`room_${roomId}`);
        response.writeHead(200, {
          "Content-Type": "application/json",
        });
        response.write(JSON.stringify(value));
        response.end();
        return true;
      } catch {
        const info = {
          id: roomId,
          allowedUsers: [],
          blockedUsers: [],
          owner: user,
          secure: false,
        } as RoomData;
        await database.put(`room_${roomId}`, info);
        response.writeHead(200, {
          "Content-Type": "application/json",
        });
        response.write(JSON.stringify(info));
        response.end();
        return true;
      }
    } else if (request.method.toLowerCase() === "post") {
      try {
        const inf = (await database.get(`room_${roomId}`)) as RoomData;
        request.on("data", (chunk) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- comment
          const data: any = JSON.parse(chunk);
          if (data.blockedUsers) {
            inf.blockedUsers = data.blockedUsers;
          }
          database
            .put(`room_${roomId}`, inf)
            .then(() => {
              console.log("room info updated");
            })
            .catch((err) => {
              console.error(err);
            });
        });
        response.writeHead(204);
        response.end();
        return true;
      } catch {
        return false;
      }
    }

    return false;
  };

  const dbClose = () => {
    database
      .close()
      .then(() => {
        console.log("Database closed");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return { processRoomConnect: processRoom, dbClose };
};
