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
  roomPresence,
  uiVisible,
} from "../../common/state";
import { DiceRollerPanel } from "../../component/DiceRoller";
import { useYjsStore } from "../../hooks/useYjsStore";
import { useAssetHandler, useGlobalInfo } from "../../hooks";
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

const HOST_URL = "ws://localhost:5001";

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
  const { registerHostedImages } = useAssetHandler(params.roomId ?? "unknown");
  const [room, setRoom] = useAtom(currentRoom);
  const [, setRp] = useAtom(roomPresence);
  const [ed, setEd] = React.useState<Editor | undefined>(undefined);
  const { uiOverrides } = useUiOverride(ed, params.roomId ?? "unknown");
  const { isBlocked } = useGlobalInfo(ed);

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

  useEffect(() => {
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
    setRp(ps);
  }, [roomConnector.awareness, roomConnector.synced, roomConnector, setRp]);

  const mount = useCallback(
    (editor: Editor) => {
      editor.updateInstanceState({ isDebugMode: false, isChatting: true });
      editor.user.updateUserPreferences({ locale: "en" });
      registerHostedImages(editor);
      setEd(editor);
      const s = store.store;
      if (!s) return;
      s.onAfterChange = (
        prev: TLRecord,
        next: TLRecord,
        _source: "remote" | "user"
      ) => {
        const id = createShapeId(GLOBAL_INFO_SHAPE);
        if (next.id === id || prev.id === id) {
          const banlist = next.meta.banned as string[];
          if (banlist.includes(editor.user.getId())) window.location.reload();
        }
      };
    },
    [registerHostedImages, store.store]
  );

  const blocked = useMemo(() => {
    if (!ed) return;
    return isBlocked(ed.user.getId());
  }, [ed, isBlocked]);

  return (
    <div className={drawBoardViewRoottyle}>
      <Tldraw
        hideUi={blocked}
        inferDarkMode
        onMount={mount}
        overrides={uiOverrides}
        shapeUtils={customShapeUtils}
        store={store}
        tools={customTools}
      >
        {!blocked && (
          <>
            <MainUI />
            <DiceRollerPanel />
            <AssetList roomId={room ?? ""} />
          </>
        )}
        {blocked ? (
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
