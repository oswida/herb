import { Button, Canvas, Input, Tldraw } from "@tldraw/tldraw";
import { appPanelStyle, flexColumnStyle } from "../../common";
import * as React from "react";
import { drawBoardViewRoottyle } from "../DrawboardView/style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useCreator } from "../../hooks";
import useLocalStorage from "use-local-storage";

const port = import.meta.env.DEV ? 5001 : window.location.port;
const CREATOR_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/creator`;

export const RoomCreateView = () => {
  // need to get tldraw local data, but editor is not initialized
  const [ldata, setLData] = useLocalStorage("TLDRAW_USER_DATA_v3", {});
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const { isCreator } = useCreator((ldata as any).user.id, CREATOR_URL);

  const go = () => {
    if (room.trim() === "") return;
    navigate(`r/${room}`, { replace: true });
  };

  const create = () => {
    const id = v4();
    navigate(`r/${id}`, { replace: true });
  };

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
          }}
        >
          <div
            className={flexColumnStyle({})}
            style={{ justifyContent: "center", flex: 1 }}
          >
            <h3 style={{ alignSelf: "center" }}>HERB</h3>
            <span>Existing room</span>
            <Input
              className="tlui-embed-dialog__input"
              placeholder="Room id to connect"
              onValueChange={(value) => setRoom(value)}
            />
            <Button type="normal" onClick={go}>
              Connect
            </Button>
            {isCreator && (
              <>
                <hr
                  style={{ width: "100%", borderColor: "var(--color-text-3)" }}
                ></hr>
                <Button type="normal" onClick={create}>
                  Create new room
                </Button>
              </>
            )}
          </div>
        </div>
      </Tldraw>
    </div>
  );
};
