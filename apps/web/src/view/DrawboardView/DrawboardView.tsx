/* eslint-disable @typescript-eslint/no-unsafe-member-access -- because */
import type { Editor } from "@tldraw/tldraw";
import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as React from "react";
import { currentRoom, uiVisible, urlRoom, urlUpload } from "../../common/state";
import { DiceRollerPanel } from "../../component/DiceRoller";
import { useYjsStore } from "../../hooks/useYjsStore";
import { useAssetHandler, useRoomInfo } from "../../hooks";
import { PdfShapeUtil } from "../../shapes/PdfShape";
import {
  RpgClockShapeTool,
  RpgClockShapeUtil,
} from "../../shapes/RpgClockShape";
import { useUiOverride } from "../../hooks/useUiOverride";
import { AssetList } from "../../component/AssetList";
import {
  CardStackShapeTool,
  CardStackShapeUtil,
  MarkdownShapeUtil,
} from "../../shapes";
import { HiddenShapeUtil } from "../../shapes/HiddenShape";
import { drawBoardViewRoottyle } from "./style.css";
import { MainUI } from "./MainUi";
import { TimerShapeTool, TimerShapeUtil } from "../../shapes/TimerShape";
import {
  RpgResourceShapeTool,
  RpgResourceShapeUtil,
} from "../../shapes/RpgResourceShape";
import { DiceAnimator } from "./DiceAnimator";
import {
  DiceRollerShapeTool,
  DiceRollerShapeUtil,
} from "../../shapes/DiceRollerShape";
import { DiceShapeUtil } from "../../shapes/DiceShape";

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
  TimerShapeUtil,
  RpgResourceShapeUtil,
  DiceRollerShapeUtil,
  DiceShapeUtil,
  CardStackShapeUtil,
];

const customTools = [
  RpgClockShapeTool,
  TimerShapeTool,
  RpgResourceShapeTool,
  DiceRollerShapeTool,
  CardStackShapeTool,
];

const customIcons = {
  timer: "/icons/timer.svg",
  "rpg-clock": "/icons/rpg-clock.svg",
  "rpg-resource": "/icons/rpg-resource.svg",
  "rpg-dice": "/icons/cubes.svg",
  "rpg-cards": "/icons/cards.svg",
};

export const DrawboardView = () => {
  const [visible] = useAtom(uiVisible);
  const params = useParams();
  const { registerHostedImages } = useAssetHandler(
    params.roomId ?? "unknown",
    UPLOAD_BASE_URL
  );
  const [room, setRoom] = useAtom(currentRoom);
  const [ed, setEd] = React.useState<Editor | undefined>(undefined);
  const { uiOverrides } = useUiOverride(
    ed,
    params.roomId ?? "unknown",
    UPLOAD_BASE_URL
  );
  const { isBlocked, blockUser, blockedList, isOwner, ownerId, ownerName } =
    useRoomInfo(ed, ROOM_BASE_URL);
  const setUrlRoom = useSetAtom(urlRoom);
  const setUrlUpload = useSetAtom(urlUpload);

  if (!params.roomId) {
    return <div>No room ID</div>;
  }

  useEffect(() => {
    setRoom(params.roomId);
  }, [params, setRoom]);

  const { storeWithStatus: store } = useYjsStore({
    roomId: params.roomId,
    hostUrl: HOST_URL,
    shapeUtils: customShapeUtils,
  });

  const mount = useCallback(
    (editor: Editor) => {
      editor.updateInstanceState({ isDebugMode: false, isChatting: true });
      editor.user.updateUserPreferences({ locale: "en" });
      registerHostedImages(editor);
      setUrlRoom(ROOM_BASE_URL);
      setUrlUpload(UPLOAD_BASE_URL);
      setEd(editor);
    },
    [registerHostedImages]
  );

  return (
    <div className={drawBoardViewRoottyle}>
      <Tldraw
        hideUi={!visible}
        inferDarkMode
        onMount={mount}
        overrides={uiOverrides}
        shapeUtils={customShapeUtils}
        store={store}
        tools={customTools}
        acceptedImageMimeTypes={[
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/svg+xml",
          "image/webp",
        ]}
        assetUrls={{ icons: customIcons }}
        components={{
          InFrontOfTheCanvas: () => (
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
              <DiceAnimator />
            </>
          ),
        }}
      />
    </div>
  );
};
