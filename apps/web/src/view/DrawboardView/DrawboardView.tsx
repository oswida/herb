/* eslint-disable @typescript-eslint/no-unsafe-member-access -- because */
import type { Editor, TLUiEventSource } from "@tldraw/tldraw";
import {
  DefaultMainMenu,
  DefaultMainMenuContent,
  Tldraw,
  TldrawUi,
  TldrawUiButton,
  TldrawUiMenuGroup,
  TldrawUiMenuItem,
  TldrawUiMenuSubmenu,
} from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import {
  currentRoom,
  customSettingsVisible,
  roomData,
  selectedCustomShape,
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
  MarkdownShapeTool,
  MarkdownShapeUtil,
  RpgAttrShapeTool,
  RpgAttrShapeUtil,
  RpgCardStackShapeTool,
  RpgCardStackShapeUtil,
  RpgDiceRollerShapeTool,
  RpgDiceRollerShapeUtil,
  RpgGenShapeTool,
  RpgGenShapeUtil,
  RpgPbtaRollShapeTool,
  RpgPbtaRollShapeUtil,
} from "../../shapes";
import { drawBoardViewRoottyle } from "./style.css";
import { MainUI } from "./MainUi";
import {
  RpgResourceShapeTool,
  RpgResourceShapeUtil,
} from "../../shapes/RpgResourceShape";
import { UserNotAlowed } from "./UserNotAllowed";
import { appPanelStyle } from "../../common";
import { CustomSettings } from "../../component/CustomSettings";
import { RpgDiceShapeUtil } from "../../shapes/DiceShape";
import { RpgCardShapeUtil } from "../../shapes/CardShape";
import { MainMenu } from "./MainMenu";

const port = import.meta.env.DEV ? 5001 : window.location.port;
const websockSchema = window.location.protocol === "https:" ? "wss" : "ws";
const HOST_URL = `${websockSchema}://${window.location.hostname}:${port}`;

const UPLOAD_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/upload`;
const ROOM_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/room`;
const CREATOR_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/creator`;

const customShapeUtils = [
  PdfShapeUtil,
  RpgClockShapeUtil,
  RpgResourceShapeUtil,
  RpgDiceRollerShapeUtil,
  RpgDiceShapeUtil,
  RpgCardStackShapeUtil,
  RpgCardShapeUtil,
  RpgAttrShapeUtil,
  RpgPbtaRollShapeUtil,
  RpgGenShapeUtil,
  MarkdownShapeUtil,
];

const customTools = [
  RpgClockShapeTool,
  RpgResourceShapeTool,
  RpgDiceRollerShapeTool,
  RpgCardStackShapeTool,
  RpgAttrShapeTool,
  RpgPbtaRollShapeTool,
  RpgGenShapeTool,
  MarkdownShapeTool,
];

const customIcons = {
  timer: "/icons/timer.svg",
  "rpg-clock": "/icons/pie-chart.svg",
  "rpg-resource": "/icons/rpg-resource.svg",
  "rpg-dice": "/icons/dice-6.svg",
  "rpg-cards": "/icons/card-ace.svg",
  "rpg-attr": "/icons/rpg-attr.svg",
  "rpg-pbta-roll": "/icons/pbta-move.svg",
  "rpg-gen": "/icons/rpg-gen.svg",
};

const customPrefix = "rpg";

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
  const setCustomPanelVisible = useSetAtom(customSettingsVisible);
  const setSelectedCustomShape = useSetAtom(selectedCustomShape);

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
      editor.addListener("update", () => {
        const shape = editor.getOnlySelectedShape();
        setCustomPanelVisible(false);
        setSelectedCustomShape(null);
        if (!shape) {
          setSelectedCustomShape(null);
          return;
        }
        if (shape.type.startsWith(customPrefix)) {
          setCustomPanelVisible(true);
          setSelectedCustomShape(shape.id);
        } else {
          setCustomPanelVisible(false);
          setSelectedCustomShape(null);
        }
      });
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
            <TldrawUiButton type="normal" onPointerDown={() => navigate("/")}>
              Main page
            </TldrawUiButton>
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
          MainMenu: () => (
            <MainMenu
              roomId={room ? room : ""}
              baseUrl={UPLOAD_BASE_URL}
              roomProvider={roomProvider}
            />
          ),
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
              <DiceRollerPanel isOwner={isOwner} roomProvider={roomProvider} />
              <AssetList roomId={room ?? ""} />
              <CustomSettings />
            </>
          ),
        }}
      />
    </div>
  );
};
