import type { IncomingMessage, Server } from "http";
import type { Duplex } from "node:stream";
import WebSocket from "ws";
import serveStatic from "serve-static";
import type { Express } from "express";
import { useSetup } from "./useSetup";
import { initUpload, processUploadGet, processUploadPost } from "./upload";
import { processRoomGet, processRoomPost } from "./room";
import { processCreators } from "./creators";
import { initAssets, processAssetDelete, processAssetGet } from "./assets";
import { closeDb, initDb } from "./db";

const setupServer = (server: Server, app: Express) => {
  const wss = new WebSocket.Server({ noServer: true });
  const { setupWSConnection } = useSetup();
  wss.on("connection", setupWSConnection);
  server.on(
    "upgrade",
    (request: IncomingMessage, socket: Duplex, head: Buffer) => {
      const handleAuth = (ws: unknown) => {
        wss.emit("connection", ws, request);
      };
      wss.handleUpgrade(request, socket, head, handleAuth);
    }
  );
  // creators
  app.get("/api/creator/:userId", (request, response) => {
    processCreators(request, response);
  });
  // assets
  initAssets();
  app.get("/api/asset/:assetType/:roomId/:action", (request, response) => {
    processAssetGet(request, response);
  });
  app.delete("/api/asset/:assetType/:roomId/:file", (request, response) => {
    processAssetDelete(request, response);
  });
  // upload
  initUpload();
  app.get("/api/upload/:fileType/:roomId/:filename", (request, response) => {
    processUploadGet(request, response);
  });
  app.post("/api/upload/:fileType/:roomId/:filename", (request, response) => {
    processUploadPost(request, response);
  });
  const db = initDb();
  // rooms
  app.get("/api/room/:roomId/:user", (request, response) => {
    processRoomGet(db, request, response).catch((err) => {
      console.error(err);
    });
  });
  app.post("/api/room/:roomId/:user", (request, response) => {
    processRoomPost(db, request, response).catch((err) => {
      console.error(err);
    });
  });
  app.get("/r/:roomId", (req, res) => {
    res.sendFile(`${__dirname}/static/index.html`);
  });
  app.use(serveStatic("static"));

  server.on("close", () => {
    closeDb(db);
  });
};

export default setupServer;
