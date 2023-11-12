import {
  Button,
  Dialog,
  Input,
  TLUiDialogProps,
  getUserPreferences,
  setUserPreferences,
  useEditor,
} from "@tldraw/tldraw";
import { flexColumnStyle } from "../../common";
import React, { useState } from "react";
import Compact from "@uiw/react-color-compact";

export const Settings = (props: TLUiDialogProps) => {
  const user = getUserPreferences();
  const [username, setUsername] = useState(user.name);
  const [color, setColor] = useState(user.color ? user.color : "#000000");

  const update = () => {
    props.onClose();
    setUserPreferences({ ...user, color: color, name: username });
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Settings</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})}>
          <div>Name</div>
          <Input
            className="tlui-embed-dialog__input"
            placeholder=""
            defaultValue={user.name !== null ? user.name : ""}
            autofocus
            onValueChange={(value) => {
              setUsername(value);
            }}
          />
          <Compact
            style={{ alignSelf: "center" }}
            data-color-mode="dark"
            color={color}
            onChange={(color) => setColor(color.hex)}
          />
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button onClick={update} type="normal">
            Save
          </Button>
        </div>
      </Dialog.Footer>
    </>
  );
};
