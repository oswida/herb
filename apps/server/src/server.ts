import { createServer } from "http";
import WebSocket from "ws";
import { useSetup } from "./useSetup";
import { useFileUpload } from "./useFileUpload";
import { useCors } from "./useCors";

export const useServer = () => {
  const wss = new WebSocket.Server({ noServer: true });

  const { processUpload } = useFileUpload();
  const { cors } = useCors();

  const server = createServer((request, response) => {
    if (cors(request, response)) return;
    if (processUpload(request, response)) return;
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("okay");
  });

  const { setupWSConnection } = useSetup();
  wss.on("connection", setupWSConnection);

  server.on("upgrade", (request, socket, head) => {
    // You may check auth of request here..
    // See https://github.com/websockets/ws#client-authentication
    /**
     * @param {any} ws
     */
    const handleAuth = (ws: any) => {
      wss.emit("connection", ws, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
  });

  return { server };
};
