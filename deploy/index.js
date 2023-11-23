"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_node_http = require("http");
var import_node_fs3 = require("fs");
var import_ws = __toESM(require("ws"));
var import_serve_static = __toESM(require("serve-static"));

// src/useSetup.ts
var import_y_leveldb = require("y-leveldb");
var import_yjs = require("yjs");
var import_lib0 = require("lib0");
var import_sync = require("y-protocols/sync");
var import_awareness = require("y-protocols/awareness");
var useSetup = () => {
  const wsReadyStateConnecting = 0;
  const wsReadyStateOpen = 1;
  const wsReadyStateClosing = 2;
  const wsReadyStateClosed = 3;
  const gcEnabled = process.env.GC !== "false" && process.env.GC !== "0";
  const persistenceDir = "ydata";
  let persistence = null;
  console.info('Persisting documents to "' + persistenceDir + '"');
  const ldb = new import_y_leveldb.LeveldbPersistence(persistenceDir);
  persistence = {
    provider: ldb,
    bindState: async (docName, ydoc) => {
      const persistedYdoc = await ldb.getYDoc(docName);
      const newUpdates = (0, import_yjs.encodeStateAsUpdate)(ydoc);
      ldb.storeUpdate(docName, newUpdates);
      (0, import_yjs.applyUpdate)(ydoc, (0, import_yjs.encodeStateAsUpdate)(persistedYdoc));
      ydoc.on("update", (update) => {
        ldb.storeUpdate(docName, update);
      });
    },
    writeState: async (docName, ydoc) => {
    }
  };
  const docs = /* @__PURE__ */ new Map();
  const messageSync = 0;
  const messageAwareness = 1;
  const updateHandler = (update, origin, doc) => {
    const encoder = import_lib0.encoding.createEncoder();
    import_lib0.encoding.writeVarUint(encoder, messageSync);
    (0, import_sync.writeUpdate)(encoder, update);
    const message = import_lib0.encoding.toUint8Array(encoder);
    doc.conns.forEach((_, conn) => send(doc, conn, message));
  };
  class WSSharedDoc extends import_yjs.Doc {
    /**
     * @param {string} name
     */
    constructor(name) {
      super({ gc: gcEnabled });
      this.name = name;
      this.conns = /* @__PURE__ */ new Map();
      this.awareness = new import_awareness.Awareness(this);
      this.awareness.setLocalState(null);
      const awarenessChangeHandler = ({
        added,
        updated,
        removed
      }, conn) => {
        const changedClients = added.concat(updated, removed);
        if (conn !== null) {
          const connControlledIDs = (
            /** @type {Set<number>} */
            this.conns.get(conn)
          );
          if (connControlledIDs !== void 0) {
            added.forEach((clientID) => {
              connControlledIDs.add(clientID);
            });
            removed.forEach((clientID) => {
              connControlledIDs.delete(clientID);
            });
          }
        }
        const encoder = import_lib0.encoding.createEncoder();
        import_lib0.encoding.writeVarUint(encoder, messageAwareness);
        import_lib0.encoding.writeVarUint8Array(
          encoder,
          (0, import_awareness.encodeAwarenessUpdate)(this.awareness, changedClients)
        );
        const buff = import_lib0.encoding.toUint8Array(encoder);
        this.conns.forEach((_, c) => {
          send(this, c, buff);
        });
      };
      this.awareness.on("update", awarenessChangeHandler);
      this.on("update", updateHandler);
    }
  }
  const getYDoc = (docname, gc = true) => import_lib0.map.setIfUndefined(docs, docname, () => {
    const doc = new WSSharedDoc(docname);
    doc.gc = gc;
    if (persistence !== null) {
      persistence.bindState(docname, doc);
    }
    docs.set(docname, doc);
    return doc;
  });
  const messageListener = (conn, doc, message) => {
    try {
      const encoder = import_lib0.encoding.createEncoder();
      const decoder = import_lib0.decoding.createDecoder(message);
      const messageType = import_lib0.decoding.readVarUint(decoder);
      switch (messageType) {
        case messageSync:
          import_lib0.encoding.writeVarUint(encoder, messageSync);
          (0, import_sync.readSyncMessage)(decoder, encoder, doc, conn);
          if (import_lib0.encoding.length(encoder) > 1) {
            send(doc, conn, import_lib0.encoding.toUint8Array(encoder));
          }
          break;
        case messageAwareness: {
          (0, import_awareness.applyAwarenessUpdate)(
            doc.awareness,
            import_lib0.decoding.readVarUint8Array(decoder),
            conn
          );
          break;
        }
      }
    } catch (err) {
      console.error("messageListener error: ", err);
      doc.emit("error", [err]);
    }
  };
  const closeConn = (doc, conn) => {
    if (doc.conns.has(conn)) {
      const controlledIds = doc.conns.get(conn);
      if (!controlledIds)
        return;
      doc.conns.delete(conn);
      (0, import_awareness.removeAwarenessStates)(doc.awareness, Array.from(controlledIds), null);
      if (doc.conns.size === 0 && persistence !== null) {
        persistence.writeState(doc.name, doc).then(() => {
          doc.destroy();
        });
        docs.delete(doc.name);
      }
    }
    conn.close();
  };
  const send = (doc, conn, m) => {
    if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
      closeConn(doc, conn);
    }
    try {
      conn.send(
        m,
        /** @param {any} err */
        (err) => {
          err != null && closeConn(doc, conn);
        }
      );
    } catch (e) {
      closeConn(doc, conn);
    }
  };
  const pingTimeout = 3e4;
  const setupWSConnection = (conn, req, { docName = req.url.slice(1).split("?")[0], gc = true } = {}) => {
    conn.binaryType = "arraybuffer";
    const doc = getYDoc(docName, gc);
    doc.conns.set(conn, /* @__PURE__ */ new Set());
    conn.on(
      "message",
      /** @param {ArrayBuffer} message */
      (message) => messageListener(conn, doc, new Uint8Array(message))
    );
    let pongReceived = true;
    const pingInterval = setInterval(() => {
      if (!pongReceived) {
        if (doc.conns.has(conn)) {
          closeConn(doc, conn);
        }
        clearInterval(pingInterval);
      } else if (doc.conns.has(conn)) {
        pongReceived = false;
        try {
          conn.ping();
        } catch (e) {
          closeConn(doc, conn);
          clearInterval(pingInterval);
        }
      }
    }, pingTimeout);
    conn.on("close", () => {
      closeConn(doc, conn);
      clearInterval(pingInterval);
    });
    conn.on("pong", () => {
      pongReceived = true;
    });
    {
      const encoder = import_lib0.encoding.createEncoder();
      import_lib0.encoding.writeVarUint(encoder, messageSync);
      (0, import_sync.writeSyncStep1)(encoder, doc);
      send(doc, conn, import_lib0.encoding.toUint8Array(encoder));
      const awarenessStates = doc.awareness.getStates();
      if (awarenessStates.size > 0) {
        const encoder2 = import_lib0.encoding.createEncoder();
        import_lib0.encoding.writeVarUint(encoder2, messageAwareness);
        import_lib0.encoding.writeVarUint8Array(
          encoder2,
          (0, import_awareness.encodeAwarenessUpdate)(
            doc.awareness,
            Array.from(awarenessStates.keys())
          )
        );
        send(doc, conn, import_lib0.encoding.toUint8Array(encoder2));
      }
    }
  };
  return { persistence, getYDoc, setupWSConnection, docs };
};

// src/useFileUpload.ts
var import_node_fs = require("fs");
var import_mime = __toESM(require("mime"));
var makeDirs = () => {
  if (!(0, import_node_fs.existsSync)("upload")) {
    (0, import_node_fs.mkdirSync)("upload");
  }
  const subs = ["image", "pdf", "handout"];
  subs.forEach((v, i) => {
    if (!(0, import_node_fs.existsSync)(`upload/${subs[i]}`)) {
      (0, import_node_fs.mkdirSync)(`upload/${subs[i]}`);
    }
  });
};
var useFileUpload = () => {
  makeDirs();
  const processUpload = (request, response) => {
    var _a;
    if (!((_a = request.url) == null ? void 0 : _a.startsWith("/api/upload")) || request.method === void 0)
      return false;
    const parts = request.url.split("/");
    if (parts.length < 6)
      return false;
    const fileType = parts[3];
    const roomId = parts[4];
    const filename = parts[5];
    if (!(0, import_node_fs.existsSync)(`upload/${fileType}/${roomId}`)) {
      (0, import_node_fs.mkdirSync)(`upload/${fileType}/${roomId}`);
    }
    if (request.method.toLowerCase() === "post") {
      const file = (0, import_node_fs.openSync)(`upload/${fileType}/${roomId}/${filename}`, "w");
      request.on("data", (chunk) => {
        (0, import_node_fs.writeSync)(file, chunk);
      });
      request.on("end", () => {
        (0, import_node_fs.closeSync)(file);
      });
      response.end();
      return true;
    }
    if (request.method.toLowerCase() === "get") {
      const fname = `upload/${fileType}/${roomId}/${filename}`;
      if (!(0, import_node_fs.existsSync)(fname))
        return false;
      const buff = (0, import_node_fs.readFileSync)(fname);
      const mt = import_mime.default.getType(filename);
      response.writeHead(200, {
        "Content-Type": mt ? mt : "application/octet-stream",
        "Content-length": buff.length
      });
      response.write(buff);
      response.end();
      return true;
    }
    return false;
  };
  return { processUpload };
};

// src/useCors.ts
var useCors = () => {
  const origin = "*";
  const maxAge = 60 * 60 * 24;
  const cors = (request, response) => {
    const reqOrigin = request.headers.origin;
    const reqHeaders = request.headers["access-control-request-headers"];
    const reqMethod = request.headers["access-control-request-method"];
    if (typeof reqOrigin !== "undefined") {
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Access-Control-Max-Age", maxAge.toString());
    }
    if (reqHeaders)
      response.setHeader("Access-Control-Allow-Headers", reqHeaders);
    if (reqMethod)
      response.setHeader("Access-Control-Allow-Methods", reqMethod);
    if (request.method === "OPTIONS") {
      response.statusCode = 204;
      response.end();
      return true;
    }
    return false;
  };
  return { cors };
};

// src/useAsset.ts
var import_node_fs2 = require("fs");
var import_mime2 = __toESM(require("mime"));
var useAsset = () => {
  if (!(0, import_node_fs2.existsSync)("upload")) {
    (0, import_node_fs2.mkdirSync)("upload");
  }
  const processAsset = (request, response) => {
    var _a;
    if (!((_a = request.url) == null ? void 0 : _a.startsWith("/api/asset")) || request.method === void 0)
      return false;
    const parts = request.url.split("/");
    if (parts.length < 6)
      return false;
    const assetType = parts[3];
    const roomId = parts[4];
    const action = parts[5];
    if (request.method.toLowerCase() === "get") {
      switch (action) {
        case "asset-list": {
          if (!(0, import_node_fs2.existsSync)(`upload/${assetType}/${roomId}`)) {
            (0, import_node_fs2.mkdirSync)(`upload/${assetType}/${roomId}`);
          }
          const files = (0, import_node_fs2.readdirSync)(`upload/${assetType}/${roomId}`, {
            withFileTypes: true
          });
          response.writeHead(200, {
            "Content-Type": "application/json"
          });
          const resp = files.filter((it) => it.isFile()).map((it) => ({ filename: it.name, mime: import_mime2.default.getType(it.name) }));
          response.write(JSON.stringify(resp));
          response.end();
          return true;
        }
        default:
          return false;
      }
    } else if (request.method.toLowerCase() === "delete") {
      const path = `upload/${assetType}/${roomId}/${action}`;
      if ((0, import_node_fs2.existsSync)(path)) {
        (0, import_node_fs2.rmSync)(path);
        return true;
      }
    }
    return false;
  };
  return { processAsset };
};

// src/server.ts
var useServer = () => {
  const wss = new import_ws.default.Server({ noServer: true });
  const { processUpload } = useFileUpload();
  const { cors } = useCors();
  const { processAsset } = useAsset();
  const serve = (0, import_serve_static.default)("static");
  const server2 = (0, import_node_http.createServer)((request, response) => {
    if (cors(request, response))
      return;
    if (processUpload(request, response))
      return;
    if (processAsset(request, response))
      return;
    serve(request, response, (err) => {
      console.error("Static serve error: ", err);
      const fname = "static/index.html";
      if (!(0, import_node_fs3.existsSync)(fname)) {
        response.writeHead(404);
        response.end();
        return;
      }
      const buff = (0, import_node_fs3.readFileSync)(fname);
      response.writeHead(200, {
        "Content-Type": "text/html",
        "Content-length": buff.length
      });
      response.write(buff);
      response.end();
    });
  });
  const { setupWSConnection } = useSetup();
  wss.on("connection", setupWSConnection);
  server2.on("upgrade", (request, socket, head) => {
    const handleAuth = (ws) => {
      wss.emit("connection", ws, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
  });
  return { server: server2 };
};

// src/index.ts
var port = process.env.PORT || 5001;
var { server } = useServer();
server.listen(port, () => {
  console.log(`running at on port ${port}`);
});
