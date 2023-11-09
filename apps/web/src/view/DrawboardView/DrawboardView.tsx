import { Canvas, ContextMenu, Editor, Tldraw, track } from "@tldraw/tldraw";
import { useYjsStore } from "../../hooks/useYjsStore";
import "@tldraw/tldraw/tldraw.css";
import { MainUI } from "./MainUi";
import { DiceRollerPanel } from "../../component/DiceRoller";
import { csheetVisible, currentRoom, uiVisible } from "../../common/state";
import { useAtom, useAtomValue } from "jotai";
import { CsViewer } from "../../component/CsViewer";
import { useCallback, useEffect } from "react";
import { hideRestUi, hideStylePanel } from "../../common/utils";
import { NoteViewer } from "../../component/NoteViewer";
import { useParams } from "react-router-dom";
import { drawBoardViewRoottyle } from "./style.css";
import * as React from "react";
import { registerPdfContent, useAssetHandler } from "../../hooks";
import { PdfShapeUtil } from "../../shapes/PdfShape";
import {
  RpgClockShapeTool,
  RpgClockShapeUtil,
} from "../../shapes/RpgClockShape";
import { uiOverrides } from "./ui-overrides";

const HOST_URL = "ws://localhost:5001";

const customShapeUtils = [PdfShapeUtil, RpgClockShapeUtil];
const customTools = [RpgClockShapeTool];

export const DrawboardView = track(() => {
  const [visible, setVisible] = useAtom(uiVisible);
  const cs = useAtomValue(csheetVisible);
  const params = useParams();
  const { registerHostedImages } = useAssetHandler();
  const [room, setRoom] = useAtom(currentRoom);

  if (!params.roomId) {
    return <div>No room ID</div>;
  }

  useEffect(() => {
    setRoom(params.roomId);
  }, [params]);

  const store = useYjsStore({
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

  const mount = useCallback((editor: Editor) => {
    editor.updateInstanceState({ isDebugMode: false, isChatting: true });
    editor.user.updateUserPreferences({ locale: "en" });
    registerHostedImages(editor);
    registerPdfContent(editor);
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
        <ContextMenu>
          <Canvas />
        </ContextMenu>
        <MainUI />
        <DiceRollerPanel />
        <NoteViewer />
        <CsViewer />
      </Tldraw>
    </div>
  );
});
