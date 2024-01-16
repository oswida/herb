/* eslint-disable @typescript-eslint/no-unsafe-member-access -- because */
import type { Editor } from "@tldraw/tldraw";
import { Button, Canvas, Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import {
  currentRoom,
  roomData,
  uiVisible,
  urlRoom,
  urlUpload,
} from "../../common/state";
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
import { drawBoardViewRoottyle } from "./style.css";
import { MainUI } from "./MainUi";
import { TimerShapeTool, TimerShapeUtil } from "../../shapes/TimerShape";
import {
  RpgResourceShapeTool,
  RpgResourceShapeUtil,
} from "../../shapes/RpgResourceShape";
import {
  DiceRollerShapeTool,
  DiceRollerShapeUtil,
} from "../../shapes/DiceRollerShape";
import { DiceShapeUtil } from "../../shapes/DiceShape";
import { UserNotAlowed } from "./UserNotAllowed";
import { appPanelStyle } from "../../common";
import { CardShapeUtil } from "../../shapes/CardShape";

const port = import.meta.env.DEV ? 5001 : window.location.port;
const websockSchema = window.location.protocol === "https:" ? "wss" : "ws";
const HOST_URL = `${websockSchema}://${window.location.hostname}:${port}`;

const UPLOAD_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/upload`;
const ROOM_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/room`;
const CREATOR_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/creator`;

const customShapeUtils = [
  PdfShapeUtil,
  RpgClockShapeUtil,
  MarkdownShapeUtil,
  TimerShapeUtil,
  RpgResourceShapeUtil,
  DiceRollerShapeUtil,
  DiceShapeUtil,
  CardStackShapeUtil,
  CardShapeUtil,
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
  const navigate = useNavigate();
  const [visible] = useAtom(uiVisible);
  const params = useParams();
  const { registerHostedImages } = useAssetHandler(
    params.roomId ?? "unknown",
    UPLOAD_BASE_URL
  );
  const [room, setRoom] = useAtom(currentRoom);
  const [ed, setEd] = React.useState<Editor | undefined>(undefined);

  const { storeWithStatus: store, room: roomProvider } = useYjsStore({
    roomId: params.roomId,
    hostUrl: HOST_URL,
    shapeUtils: customShapeUtils,
  });

  const { uiOverrides } = useUiOverride(
    ed,
    params.roomId ?? "unknown",
    UPLOAD_BASE_URL,
    roomProvider
  );
  const {
    isOwner,
    ownerName,
    isUserAllowed,
    allowUser,
    allowedUsers,
    blockUser,
    blockedList,
    isBlocked,
    changeSecret,
    login,
  } = useRoomInfo(ROOM_BASE_URL);
  const setUrlRoom = useSetAtom(urlRoom);
  const setUrlUpload = useSetAtom(urlUpload);
  const [rdata, _] = useAtom(roomData);

  useEffect(() => {
    setRoom(params.roomId);
  }, [params, setRoom]);

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

  if (!params.roomId) {
    return <div>No room ID</div>;
  }

  if (!rdata) {
    return (
      <div className={drawBoardViewRoottyle}>
        <Tldraw autoFocus inferDarkMode hideUi>
          <Canvas />
          <div
            className={appPanelStyle}
            style={{
              position: "absolute",
              left: "calc(50% - 100px)",
              top: "calc(50% - 125px)",
              width: "200px",
              height: "250px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h3>Room not found</h3>
            <Button type="normal" onPointerDown={() => navigate("/")}>
              Main page
            </Button>
          </div>
        </Tldraw>
      </div>
    );
  }

  return (
    <div className={drawBoardViewRoottyle}>
      <Tldraw
        hideUi={!visible || !isUserAllowed}
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
          OnTheCanvas: () => (
            <UserNotAlowed
              isUserAllowed={isUserAllowed}
              room={room}
              blockUser={blockUser}
              isBlocked={isBlocked}
              login={login}
            />
          ),
          InFrontOfTheCanvas: () => (
            <>
              <MainUI
                ownerName={ownerName}
                isOwner={isOwner}
                isUserAllowed={isUserAllowed}
                allowUser={allowUser}
                allowedUsers={allowedUsers}
                blockUser={blockUser}
                blockedList={blockedList}
                changeSecret={changeSecret}
              />
              <DiceRollerPanel isOwner={isOwner} />
              <AssetList roomId={room ?? ""} />
            </>
          ),
        }}
      />
    </div>
  );
};
