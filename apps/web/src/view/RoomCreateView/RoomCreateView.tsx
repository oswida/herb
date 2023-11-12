import {
  Button,
  Canvas,
  Dialog,
  Input,
  TLUiDialogProps,
  Tldraw,
} from "@tldraw/tldraw";
import { appPanelStyle, flexColumnStyle } from "../../common";
import * as React from "react";
import { drawBoardViewRoottyle } from "../DrawboardView/style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

const RoomCreateDialog = (props: TLUiDialogProps) => {
  const create = () => {};
  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Create room</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})}>
          <div>Room name</div>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={create} type="normal">
            Create
          </Button>
        </div>
      </Dialog.Footer>
    </>
  );
};

export const RoomCreateView = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState("");

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
            <hr
              style={{ width: "100%", borderColor: "var(--color-text-3)" }}
            ></hr>
            <Button type="normal" onClick={create}>
              Create new room
            </Button>
          </div>
        </div>
      </Tldraw>
    </div>
  );
};
