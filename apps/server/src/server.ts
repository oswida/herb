import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import WebSocket from "ws";
import serveStatic from "serve-static";
import { useSetup } from "./useSetup";
import { useFileUpload } from "./useFileUpload";
import { useCors } from "./useCors";
import { useAsset } from "./useAsset";
import { useDb } from "./useDb";
import { useCreators } from "./useCreators";

export const useServer = () => {
  const wss = new WebSocket.Server({ noServer: true });

  const { processUpload } = useFileUpload();
  const { cors } = useCors();
  const { processAsset } = useAsset();
  const serve = serveStatic("static");
  const { processRoomConnect, dbClose } = useDb();
  const { processCreators } = useCreators();

  const server = createServer((request, response) => {
    if (
      cors(request, response) ||
      processUpload(request, response) ||
      processAsset(request, response) ||
      processCreators(request, response)
    ) {
      return;
    }
    processRoomConnect(request, response)
      .then((resp) => {
        if (resp) {
          return;
        }
        serve(request, response, () => {
          const fname = "static/index.html";
          if (!existsSync(fname)) {
            response.writeHead(404);
            response.end();
            return;
          }
          const buff = readFileSync(fname);
          response.writeHead(200, {
            "Content-Type": "text/html",
            "Content-length": buff.length,
          });
          response.write(buff);
          response.end();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });

  const { setupWSConnection } = useSetup();
  wss.on("connection", setupWSConnection);

  server.on("upgrade", (request, socket, head) => {
    const handleAuth = (ws: unknown) => {
      wss.emit("connection", ws, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
  });

  server.on("close", () => {
    dbClose();
  });

  return { server };
};
