import { IncomingMessage, ServerResponse } from "http";
import {
  existsSync,
  mkdirSync,
  openSync,
  writeSync,
  closeSync,
  readFileSync,
} from "fs";
import mime from "mime";

const makeDirs = () => {
  if (!existsSync("upload")) {
    mkdirSync("upload");
  }
  const subs = ["image", "pdf", "handout"];
  for (let i in subs) {
    if (!existsSync(`upload/${subs[i]}`)) {
      mkdirSync(`upload/${subs[i]}`);
    }
  }
};

export const useFileUpload = () => {
  makeDirs();

  const processUpload = (
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    }
  ) => {
    if (!request.url?.startsWith("/api/upload") || request.method === undefined)
      return false;

    const parts = request.url.split("/");
    if (parts.length < 5) return false;
    const fileType = parts[3];
    const filename = parts[4];

    if (request.method.toLowerCase() === "post") {
      const file = openSync(`upload/${fileType}/${filename}`, "w");
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
      const fname = `upload/${fileType}/${filename}`;
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
