import { Tldraw, TldrawUiButton, TldrawUiInput } from "@tldraw/tldraw";
import { appPanelStyle, flexColumnStyle } from "../../common";
import * as React from "react";
import { drawBoardViewRoottyle } from "../DrawboardView/style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useCreator, useTlDrawData } from "../../hooks";

const port = import.meta.env.DEV ? 5001 : window.location.port;
const CREATOR_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/creator`;

export const RoomCreateView = () => {
  // need to get tldraw local data, but editor is not initialized
  const { tldrawUserId } = useTlDrawData();
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const { isCreator } = useCreator(tldrawUserId, CREATOR_URL);

  const go = () => {
    if (room.trim() === "") return;
    navigate(`r/${room}`);
  };

  const create = () => {
    const id = v4();
    navigate(`r/${id}`);
  };

  return (
    <div className={drawBoardViewRoottyle}>
      <Tldraw autoFocus inferDarkMode hideUi>
        {/* <Canvas /> */}
        <div
          className={appPanelStyle}
          style={{
            position: "absolute",
            left: "calc(50% - 100px)",
            top: "calc(50% - 125px)",
            width: "200px",
            height: "250px",
            padding: "10px",
          }}
        >
          <div
            className={flexColumnStyle({})}
            style={{ justifyContent: "center", flex: 1 }}
          >
            <h3 style={{ alignSelf: "center" }}>HERB</h3>
            <span>Existing room</span>
            <TldrawUiInput
              className="tlui-embed-dialog__input"
              placeholder="Room id to connect"
              onValueChange={(value) => setRoom(value)}
            />
            <TldrawUiButton type="normal" onClick={go}>
              Connect
            </TldrawUiButton>
            {isCreator && (
              <>
                <hr
                  style={{ width: "100%", borderColor: "var(--color-text-3)" }}
                ></hr>
                <TldrawUiButton type="normal" onClick={create}>
                  Create new room
                </TldrawUiButton>
              </>
            )}
          </div>
        </div>
      </Tldraw>
    </div>
  );
};
