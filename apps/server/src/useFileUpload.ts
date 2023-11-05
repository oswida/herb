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

export const useFileUpload = () => {
  if (!existsSync("upload")) {
    mkdirSync("upload");
  }

  const processUpload = (
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    }
  ) => {
    if (!request.url?.startsWith("/api/upload") || request.method === undefined)
      return false;

    const parts = request.url.split("/");
    if (parts.length < 3) return false;
    const filename = parts[3];

    if (request.method.toLowerCase() === "post") {
      const file = openSync(`upload/${filename}`, "w");
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
      const buff = readFileSync(`upload/${filename}`);
      const mt = mime.getType(filename);
      response.writeHead(200, {
        "Content-Type": mt ? mt : "application/octet-stream",
        "Content-length": buff.length,
      });
      response.write(buff);
      response.end();

      return true;
    }

    // const form = formidable({});
    // let fields;
    // let files;
    // try {
    //   [fields, files] = await form.parse(request);
    // } catch (err: any) {
    //   if (err.code === formidableErrors.maxFieldsExceeded) {
    //   }
    //   console.error(err);
    //   response.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
    //   response.end(String(err));
    //   return false;
    // }
    // response.writeHead(200, { "Content-Type": "application/json" });

    return false;
  };
  return { processUpload };
};
