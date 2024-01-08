/* eslint-disable @typescript-eslint/no-explicit-any -- comment*/
import { LeveldbPersistence } from "y-leveldb";
import { Doc, applyUpdate, encodeStateAsUpdate } from "yjs";
import { decoding, encoding, map } from "lib0";
import { readSyncMessage, writeSyncStep1, writeUpdate } from "y-protocols/sync";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from "y-protocols/awareness";

export const useSetup = () => {
  const wsReadyStateConnecting = 0;
  const wsReadyStateOpen = 1;

  // disable gc when using snapshots!
  const gcEnabled = process.env.GC !== "false" && process.env.GC !== "0";
  const persistenceDir = "ydata";

  let persistence: any = null;

  console.info(`Persisting documents to "${persistenceDir}"`);

  const ldb = new LeveldbPersistence(persistenceDir);
  persistence = {
    provider: ldb,
    bindState: async (docName: string, ydoc: WSSharedDoc) => {
      const persistedYdoc = await ldb.getYDoc(docName);
      const newUpdates = encodeStateAsUpdate(ydoc);
      ldb.storeUpdate(docName, newUpdates).catch((err) => {
        console.error(err);
      });
      applyUpdate(ydoc, encodeStateAsUpdate(persistedYdoc));
      ydoc.on("update", (update: any) => {
        ldb.storeUpdate(docName, update).catch((err) => {
          console.error(err);
        });
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- coment
    writeState: async (_docName: string, _ydoc: WSSharedDoc) => {},
  };

  const docs = new Map();

  const messageSync = 0;
  const messageAwareness = 1;

  const updateHandler = (update: Uint8Array, origin: any, doc: WSSharedDoc) => {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    writeUpdate(encoder, update);
    const message = encoding.toUint8Array(encoder);
    doc.conns.forEach((_, conn) => {
      send(doc, conn, message);
    });
  };

  class WSSharedDoc extends Doc {
    name: string;
    conns: Map<object, Set<number>>;
    awareness: Awareness;

    constructor(name: string) {
      super({ gc: gcEnabled });
      this.name = name;

      this.conns = new Map();

      this.awareness = new Awareness(this);
      this.awareness.setLocalState(null);

      const awarenessChangeHandler = (
        {
          added,
          updated,
          removed,
        }: {
          added: number[];
          updated: number[];
          removed: number[];
        },
        conn: object | null
      ) => {
        const changedClients = added.concat(updated, removed);
        if (conn !== null) {
          const connControlledIDs = this.conns.get(conn);
          if (connControlledIDs !== undefined) {
            added.forEach((clientID) => {
              connControlledIDs.add(clientID);
            });
            removed.forEach((clientID) => {
              connControlledIDs.delete(clientID);
            });
          }
        }
        // broadcast awareness update
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageAwareness);
        encoding.writeVarUint8Array(
          encoder,
          encodeAwarenessUpdate(this.awareness, changedClients)
        );
        const buff = encoding.toUint8Array(encoder);
        this.conns.forEach((_, c) => {
          send(this, c, buff);
        });
      };
      this.awareness.on("update", awarenessChangeHandler);
      this.on("update", updateHandler);
    }
  }

  /**
   * Gets a Y.Doc by name, whether in memory or on disk
   *
   
   */
  const getYDoc = (docname: string, gc = true) =>
    map.setIfUndefined(docs, docname, () => {
      const doc = new WSSharedDoc(docname);
      doc.gc = gc;
      if (persistence !== null) {
        persistence.bindState(docname, doc);
      }
      docs.set(docname, doc);
      return doc;
    });

  const messageListener = (
    conn: any,
    doc: WSSharedDoc,
    message: Uint8Array
  ) => {
    try {
      const encoder = encoding.createEncoder();
      const decoder = decoding.createDecoder(message);
      const messageType = decoding.readVarUint(decoder);
      switch (messageType) {
        case messageSync:
          encoding.writeVarUint(encoder, messageSync);
          readSyncMessage(decoder, encoder, doc, conn);

          // If the `encoder` only contains the type of reply message and no
          // message, there is no need to send the message. When `encoder` only
          // contains the type of reply, its length is 1.
          if (encoding.length(encoder) > 1) {
            send(doc, conn, encoding.toUint8Array(encoder));
          }
          break;
        case messageAwareness: {
          applyAwarenessUpdate(
            doc.awareness,
            decoding.readVarUint8Array(decoder),
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

  const closeConn = (doc: WSSharedDoc, conn: any) => {
    if (doc.conns.has(conn)) {
      const controlledIds = doc.conns.get(conn);
      if (!controlledIds) return; // TODO: check early return
      doc.conns.delete(conn);
      removeAwarenessStates(doc.awareness, Array.from(controlledIds), null);
      if (doc.conns.size === 0 && persistence !== null) {
        persistence.writeState(doc.name, doc).then(() => {
          doc.destroy();
        });
        docs.delete(doc.name);
      }
    }
    conn.close();
  };

  const send = (doc: WSSharedDoc, conn: any, m: Uint8Array) => {
    if (
      conn.readyState !== wsReadyStateConnecting &&
      conn.readyState !== wsReadyStateOpen
    ) {
      closeConn(doc, conn);
    }
    try {
      conn.send(m, (err: any) => {
        // eslint-disable-next-line eqeqeq -- causes infinite loop, idk why
        err != null && closeConn(doc, conn);
      });
    } catch (e) {
      closeConn(doc, conn);
    }
  };

  const pingTimeout = 30000;

  const setupWSConnection = (
    conn: any,
    req: any,
    { docName = req.url.slice(1).split("?")[0], gc = true } = {}
  ) => {
    conn.binaryType = "arraybuffer";
    const doc = getYDoc(docName, gc);
    doc.conns.set(conn, new Set());
    conn.on("message", (message: ArrayBuffer) => {
      messageListener(conn, doc, new Uint8Array(message));
    });

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
    // put the following in a variables in a block so the interval handlers don't keep in in
    // scope
    {
      // send sync step 1
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSync);
      writeSyncStep1(encoder, doc);
      send(doc, conn, encoding.toUint8Array(encoder));
      const awarenessStates = doc.awareness.getStates();
      if (awarenessStates.size > 0) {
        const encoder2 = encoding.createEncoder();
        encoding.writeVarUint(encoder2, messageAwareness);
        encoding.writeVarUint8Array(
          encoder2,
          encodeAwarenessUpdate(
            doc.awareness,
            Array.from(awarenessStates.keys())
          )
        );
        send(doc, conn, encoding.toUint8Array(encoder2));
      }
    }
  };
  return { persistence, getYDoc, setupWSConnection, docs };
};
