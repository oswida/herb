/* eslint-disable @typescript-eslint/explicit-function-return-type -- comment */
import type { IncomingMessage, ServerResponse } from "node:http";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import mime from "mime";

export const useAsset = () => {
  if (!existsSync("upload")) {
    mkdirSync("upload");
  }

  const processAsset = (
    request: IncomingMessage,
    response: ServerResponse & {
      req: IncomingMessage;
    }
  ) => {
    if (!request.url?.startsWith("/api/asset") || request.method === undefined)
      return false;

    const parts = request.url.split("/");
    if (parts.length < 6) return false;
    const assetType = parts[3];
    const roomId = parts[4];
    const action = parts[5];

    if (request.method.toLowerCase() === "get") {
      switch (action) {
        case "asset-list": {
          if (!existsSync(`upload/${assetType}/${roomId}`)) {
            mkdirSync(`upload/${assetType}/${roomId}`);
          }
          const files = readdirSync(`upload/${assetType}/${roomId}`, {
            withFileTypes: true,
          });
          response.writeHead(200, {
            "Content-Type": "application/json",
          });
          const resp = files
            .filter((it) => it.isFile())
            .map((it) => ({ filename: it.name, mime: mime.getType(it.name) }));
          response.write(JSON.stringify(resp));
          response.end();
          return true;
        }
        default:
          return false;
      }
    } else if (request.method.toLowerCase() === "delete") {
      const path = `upload/${assetType}/${roomId}/${action}`;
      if (existsSync(path)) {
        rmSync(path);
        return true;
      }
    }
    return false;
  };

  return { processAsset };
};
