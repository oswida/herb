import { Canvas, ContextMenu, Editor, Tldraw, track } from "@tldraw/tldraw";
import { useYjsStore } from "../../hooks/useYjsStore";
import "@tldraw/tldraw/tldraw.css";
import { MainUI } from "./MainUi";
import { DiceRollerPanel } from "../../component/DiceRoller";
import {
  csheetVisible,
  currentRoom,
  roomPresence,
  uiVisible,
} from "../../common/state";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { hideRestUi, hideStylePanel } from "../../common/utils";
import { useParams } from "react-router-dom";
import { drawBoardViewRoottyle } from "./style.css";
import * as React from "react";
import { useAssetHandler } from "../../hooks";
import { PdfShapeUtil } from "../../shapes/PdfShape";
import {
  RpgClockShapeTool,
  RpgClockShapeUtil,
} from "../../shapes/RpgClockShape";
import { Presence } from "../../common";
import { useUiOverride } from "../../hooks/useUiOverride";
import { AssetList } from "../../component/AssetList";

const HOST_URL = "ws://localhost:5001";

const customShapeUtils = [PdfShapeUtil, RpgClockShapeUtil];
const customTools = [RpgClockShapeTool];

export const DrawboardView = track(() => {
  const [visible, setVisible] = useAtom(uiVisible);
  const cs = useAtomValue(csheetVisible);
  const params = useParams();
  const { registerHostedImages } = useAssetHandler();
  const [room, setRoom] = useAtom(currentRoom);
  const [rp, setRp] = useAtom(roomPresence);
  const [ed, setEd] = React.useState<Editor | undefined>(undefined);
  const { uiOverrides } = useUiOverride(ed);

  if (!params.roomId) {
    return <div>No room ID</div>;
  }

  useEffect(() => {
    setRoom(params.roomId);
  }, [params]);

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
  }, [visible]);

  useEffect(() => {
    console.log("useEffect room connector")
    const states = roomConnector.awareness.getStates();
    if (!states) return;
    const ps: Record<string, Presence> = {};
    for (let [k, v] of states) {
      const obj = states.get(k);
      if (obj && obj["presence"] !== undefined) {
        const p: Presence = {
          id: obj.presence.userId,
          name: obj.presence.userName,
          color: obj.presence.color,
        };
        ps[p.id] = p;
      }
    }
    setRp(ps);
  }, [roomConnector.awareness, roomConnector.synced, roomConnector]);

  const mount = useCallback((editor: Editor) => {
    editor.updateInstanceState({ isDebugMode: false, isChatting: true });
    editor.user.updateUserPreferences({ locale: "en" });
    registerHostedImages(editor);
    setEd(editor);
  }, []);

  return (
    <div className={drawBoardViewRoottyle}>
      <Tldraw
        autoFocus
        store={store}
        inferDarkMode
        onMount={mount}
        tools={customTools}
        shapeUtils={customShapeUtils}
        overrides={uiOverrides}
      >
        <MainUI />
        <DiceRollerPanel />
        <AssetList />
      </Tldraw>
    </div>
  );
});
