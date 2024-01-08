import type { Request, Response } from "express";
import type { Level } from "level";
import { loadCreators } from "./creators";

interface RoomData {
  owner: string;
  id: string;
  secure: boolean;
  allowedUsers: string[];
  blockedUsers: string[];
}

export const processRoomPost = async (
  database: Level<string, object>,
  request: Request,
  response: Response
) => {
  if (!request.params.user || !request.params.roomId) {
    response.sendStatus(404);
    return;
  }
  try {
    const inf = (await database.get(
      `room_${request.params.roomId}`
    )) as RoomData;
    request.on("data", (chunk) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- comment
      const data: any = JSON.parse(chunk);
      if (data.blockedUsers) {
        inf.blockedUsers = data.blockedUsers;
      }
      if (data.allowedUsers) {
        inf.allowedUsers = data.allowedUsers;
      }
      // cleanup
      inf.blockedUsers = inf.blockedUsers.filter(
        (it) => !inf.allowedUsers.includes(it)
      );

      database.put(`room_${request.params.roomId}`, inf).catch((err) => {
        console.error(err);
        response.sendStatus(500).send(err);
      });
    });
    response.sendStatus(204);
  } catch {
    response.sendStatus(503);
  }
};

export const processRoomGet = async (
  database: Level<string, object>,
  request: Request,
  response: Response
) => {
  if (!request.params.user || !request.params.roomId) {
    response.sendStatus(404);
    return;
  }
  try {
    const value = await database.get(`room_${request.params.roomId}`);
    response.json(value);
  } catch {
    const creators = loadCreators();
    if (!creators.includes(request.params.user)) {
      response.sendStatus(503);
      return;
    }
    const info = {
      id: request.params.roomId,
      allowedUsers: [],
      blockedUsers: [],
      owner: request.params.user,
      secure: false,
    } as RoomData;
    await database.put(`room_${request.params.roomId}`, info);
    response.json(info);
  }
};
