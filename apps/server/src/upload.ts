import {
  existsSync,
  mkdirSync,
  openSync,
  writeSync,
  closeSync,
  readFileSync,
} from "node:fs";
import mime from "mime";
import type { Request, Response } from "express";
import fastFolderSizeSync from "fast-folder-size/sync";
import { loadConfig } from "./config";

// /api/upload

export const initUpload = () => {
  if (!existsSync("upload")) {
    mkdirSync("upload");
  }
  const subs = ["image", "pdf", "handout"];
  subs.forEach((v, i) => {
    if (!existsSync(`upload/${subs[i]}`)) {
      mkdirSync(`upload/${subs[i]}`);
    }
  });
};

export const processUploadPost = (request: Request, response: Response) => {
  if (
    !request.params.fileType ||
    !request.params.filename ||
    !request.params.roomId
  ) {
    response.sendStatus(404);
    return;
  }

  if (
    !existsSync(`upload/${request.params.fileType}/${request.params.roomId}`)
  ) {
    mkdirSync(`upload/${request.params.fileType}/${request.params.roomId}`);
  }

  const config = loadConfig();
  const dir = `upload/${request.params.fileType}/${request.params.roomId}`;
  let folderSize = fastFolderSizeSync(dir);
  if (folderSize) {
    folderSize = folderSize / 1000000;
    if (folderSize > config.maxUploadMbPerRoom) {
      response.sendStatus(400);
      return;
    }
  }

  const fileName = `${dir}/${request.params.filename}`;

  const file = openSync(fileName, "w");
  request.on("data", (chunk) => {
    writeSync(file, chunk);
  });
  request.on("end", () => {
    closeSync(file);
  });
  response.sendStatus(204);
};

export const processUploadGet = (request: Request, response: Response) => {
  if (
    !request.params.fileType ||
    !request.params.filename ||
    !request.params.roomId
  ) {
    response.sendStatus(404);
    return;
  }

  if (
    !existsSync(`upload/${request.params.fileType}/${request.params.roomId}`)
  ) {
    mkdirSync(`upload/${request.params.fileType}/${request.params.roomId}`);
  }

  const fname = `upload/${request.params.fileType}/${request.params.roomId}/${request.params.filename}`;
  if (!existsSync(fname)) {
    response.sendStatus(404);
    return;
  }
  const buff = readFileSync(fname);
  const mt = mime.getType(request.params.filename);
  response.writeHead(200, {
    "Content-Type": mt ? mt : "application/octet-stream",
    "Content-length": buff.length,
    "Cache-Control": "public, max-age=31536000",
  });
  response.write(buff);
  response.end();
};
