import { createServer } from "node:http";
import WebSocket from "ws";
import serveStatic from "serve-static";
import { useSetup } from "./useSetup";
import { useFileUpload } from "./useFileUpload";
import { useCors } from "./useCors";
import { useAsset } from "./useAsset";

export const useServer = () => {
  const wss = new WebSocket.Server({ noServer: true });

  const { processUpload } = useFileUpload();
  const { cors } = useCors();
  const { processAsset } = useAsset();
  const serve = serveStatic("static");

  const server = createServer((request, response) => {
    if (cors(request, response)) return;
    if (processUpload(request, response)) return;
    if (processAsset(request, response)) return;
    serve(request, response, (err) => {
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

  return { server };
};
