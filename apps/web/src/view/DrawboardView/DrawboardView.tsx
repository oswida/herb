/* eslint-disable @typescript-eslint/no-unsafe-member-access -- because */
import type { Editor, TLRecord } from "@tldraw/tldraw";
import { Tldraw, createShapeId, track } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import * as React from "react";
import { hideRestUi, hideStylePanel } from "../../common/utils";
import {
  csheetVisible,
  currentRoom,
  roomData,
  roomPresence,
  uiVisible,
} from "../../common/state";
import { DiceRollerPanel } from "../../component/DiceRoller";
import { useYjsStore } from "../../hooks/useYjsStore";
import { useAssetHandler, useRoomInfo } from "../../hooks";
import { PdfShapeUtil } from "../../shapes/PdfShape";
import {
  RpgClockShapeTool,
  RpgClockShapeUtil,
} from "../../shapes/RpgClockShape";
import type { Presence } from "../../common";
import { GLOBAL_INFO_SHAPE, appPanelStyle } from "../../common";
import { useUiOverride } from "../../hooks/useUiOverride";
import { AssetList } from "../../component/AssetList";
import { MarkdownShapeUtil } from "../../shapes";
import { HiddenShapeUtil } from "../../shapes/HiddenShape";
import { drawBoardViewRoottyle } from "./style.css";
import { MainUI } from "./MainUi";
import { useQuery } from "@tanstack/react-query";

const port = import.meta.env.DEV ? 5001 : window.location.port;
const websockSchema = window.location.protocol === "https:" ? "wss" : "ws";
const HOST_URL = `${websockSchema}://${window.location.hostname}:${port}`;
const UPLOAD_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/upload`;
const ROOM_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/room`;

const customShapeUtils = [
  PdfShapeUtil,
  RpgClockShapeUtil,
  MarkdownShapeUtil,
  HiddenShapeUtil,
];
const customTools = [RpgClockShapeTool];

export const DrawboardView = track(() => {
  const [visible] = useAtom(uiVisible);
  const cs = useAtomValue(csheetVisible);
  const params = useParams();
  const { registerHostedImages } = useAssetHandler(
    params.roomId ?? "unknown",
    UPLOAD_BASE_URL
  );
  const [room, setRoom] = useAtom(currentRoom);
  const [, setRp] = useAtom(roomPresence);
  const [ed, setEd] = React.useState<Editor | undefined>(undefined);
  const { uiOverrides } = useUiOverride(
    ed,
    params.roomId ?? "unknown",
    UPLOAD_BASE_URL
  );
  const [rdata, setRdata] = useAtom(roomData);
  const {
    isBlocked,
    iamBlocked,
    blockUser,
    blockedList,
    isOwner,
    ownerId,
    ownerName,
  } = useRoomInfo(ed, ROOM_BASE_URL);

  if (!params.roomId) {
    return <div>No room ID</div>;
  }

  useEffect(() => {
    setRoom(params.roomId);
  }, [params, setRoom]);

  const { storeWithStatus: store, room: roomConnector } = useYjsStore({
    roomId: params.roomId,
    hostUrl: HOST_URL,
    shapeUtils: customShapeUtils,
  });

  useEffect(() => {
    if (visible) {
      hideRestUi(false);
      if (cs) hideStylePanel(true);
      else hideStylePanel(false);
      return;
    }
    hideStylePanel(true);
    hideRestUi(true);
  }, [cs, visible]);

  const updatePresence = useCallback(
    (e: any) => {
      if (e.added.length <= 0 && e.removed.length <= 0) return;
      const states = roomConnector.awareness.getStates();
      const ps: Record<string, Presence> = {};
      for (const [k] of states) {
        const obj = states.get(k);
        if (obj && obj.presence !== undefined) {
          const p: Presence = {
            id: obj.presence.userId as string,
            name: obj.presence.userName as string,
            color: obj.presence.color as string,
          };
          ps[p.id] = p;
        }
      }
      if (Object.keys(ps).length === 0) return;
      console.log("sync presence", ps);
      setRp(ps);
    },
    [roomConnector.awareness, roomConnector.synced, roomConnector, setRp]
  );

  useEffect(() => {
    roomConnector.awareness.off("change", updatePresence);
    roomConnector.awareness.on("change", updatePresence);
  }, [roomConnector.awareness, roomConnector.synced, roomConnector, setRp]);

  const mount = useCallback(
    (editor: Editor) => {
      editor.updateInstanceState({ isDebugMode: false, isChatting: true });
      editor.user.updateUserPreferences({ locale: "en" });
      registerHostedImages(editor);
      setEd(editor);

      // const s = store.store;
      // if (!s) return;
      // s.onAfterChange = (
      //   prev: TLRecord,
      //   next: TLRecord,
      //   _source: "remote" | "user"
      // ) => {
      //   const id = createShapeId(GLOBAL_INFO_SHAPE);
      //   if (next.id === id || prev.id === id) {
      //     const banlist = next.meta.banned as string[];
      //     if (banlist.includes(editor.user.getId())) window.location.reload();
      //   }
      // };
    },
    [registerHostedImages]
  );

  return (
    <div className={drawBoardViewRoottyle}>
      <Tldraw
        hideUi={iamBlocked}
        inferDarkMode
        onMount={mount}
        overrides={uiOverrides}
        shapeUtils={customShapeUtils}
        store={store}
        tools={customTools}
      >
        {!iamBlocked && (
          <>
            <MainUI
              ownerName={ownerName}
              isOwner={isOwner}
              blockUser={blockUser}
              blockedList={blockedList}
              isBlocked={isBlocked}
              ownerId={ownerId}
            />
            <DiceRollerPanel isOwner={isOwner} />
            <AssetList roomId={room ?? ""} />
          </>
        )}
        {iamBlocked ? (
          <div
            className={appPanelStyle}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              padding: "20px",
            }}
          >
            User blocked
          </div>
        ) : null}
      </Tldraw>
    </div>
  );
});
