/* eslint-disable @typescript-eslint/explicit-function-return-type -- comment */
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  existsSync,
  mkdirSync,
  openSync,
  writeSync,
  closeSync,
  readFileSync,
} from "node:fs";
import mime from "mime";

const makeDirs = () => {
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

export const useFileUpload = () => {
  makeDirs();

  const processUpload = (
    request: IncomingMessage,
    response: ServerResponse & {
      req: IncomingMessage;
    }
  ) => {
    if (!request.url?.startsWith("/api/upload") || request.method === undefined)
      return false;

    const parts = request.url.split("/");
    if (parts.length < 6) return false;
    const fileType = parts[3];
    const roomId = parts[4];
    const filename = parts[5];

    if (!existsSync(`upload/${fileType}/${roomId}`)) {
      mkdirSync(`upload/${fileType}/${roomId}`);
    }

    if (request.method.toLowerCase() === "post") {
      const file = openSync(`upload/${fileType}/${roomId}/${filename}`, "w");
      request.on("data", (chunk) => {
        writeSync(file, chunk);
      });
      request.on("end", () => {
        closeSync(file);
      });
      response.end();
      return true;
    }

    if (request.method.toLowerCase() === "get") {
      const fname = `upload/${fileType}/${roomId}/${filename}`;
      if (!existsSync(fname)) return false;
      const buff = readFileSync(fname);
      const mt = mime.getType(filename);
      response.writeHead(200, {
        "Content-Type": mt ? mt : "application/octet-stream",
        "Content-length": buff.length,
      });
      response.write(buff);
      response.end();

      return true;
    }

    return false;
  };
  return { processUpload };
};
