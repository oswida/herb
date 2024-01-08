import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import mime from "mime";
import type { Request, Response } from "express";

// /api/asset

export const initAssets = () => {
  if (!existsSync("upload")) {
    mkdirSync("upload");
  }
};

export const processAssetGet = (request: Request, response: Response) => {
  if (
    !request.params.assetType ||
    !request.params.action ||
    !request.params.roomId
  ) {
    response.sendStatus(404);
    return;
  }
  switch (request.params.action) {
    case "asset-list":
      {
        if (
          !existsSync(
            `upload/${request.params.assetType}/${request.params.roomId}`
          )
        ) {
          mkdirSync(
            `upload/${request.params.assetType}/${request.params.roomId}`
          );
        }
        const files = readdirSync(
          `upload/${request.params.assetType}/${request.params.roomId}`,
          {
            withFileTypes: true,
          }
        );
        const resp = files
          .filter((it) => it.isFile())
          .map((it) => ({ filename: it.name, mime: mime.getType(it.name) }));
        response.json(resp);
      }
      break;
    default: {
      response.sendStatus(404);
    }
  }
};

export const processAssetDelete = (request: Request, response: Response) => {
  if (
    !request.params.assetType ||
    !request.params.file ||
    !request.params.roomId
  ) {
    response.sendStatus(404);
    return;
  }
  const path = `upload/${request.params.assetType}/${request.params.roomId}/${request.params.file}`;
  if (existsSync(path)) {
    rmSync(path);
  }
  response.sendStatus(204);
};
