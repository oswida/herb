import { IncomingMessage, ServerResponse } from "http";
import {
  existsSync,
  mkdirSync,
  openSync,
  writeSync,
  closeSync,
  readFileSync,
  readdirSync,
} from "fs";
import mime from "mime";



export const useAsset = () => {
  if (!existsSync("upload")) {
    mkdirSync("upload");
  }

  const processAsset = (
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    }
  ) => {
    if (!request.url?.startsWith("/api/asset") || request.method === undefined)
      return false;

    const parts = request.url.split("/");
    if (parts.length < 2) return false;
    const action = parts[2];

    if (request.method.toLowerCase() === "get") {
      switch (action) {
        case "asset-list":
          const files = readdirSync("upload", { withFileTypes: true });
          response.writeHead(200, {
            "Content-Type": "application/json",
          });
          const resp = files.filter((it) => it.isFile()).map((it) => ({ filename: it.name, mime: mime.getType(it.name) }));
          response.write(JSON.stringify(resp));
          response.end();
          return true;
        default: return false;
      }
    }
    return false;
  };

  return { processAsset };
};
