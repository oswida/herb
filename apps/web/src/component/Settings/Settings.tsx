import {
  Button,
  Dialog,
  Input,
  TLUiDialogProps,
  getUserPreferences,
  setUserPreferences,
} from "@tldraw/tldraw";
import { flexColumnStyle } from "../../common";
import React, { useState } from "react";

export const Settings = (props: TLUiDialogProps) => {
  const user = getUserPreferences();
  const [username, setUsername] = useState(user.name);
  const [color, setColor] = useState(user.color);

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
        <div className={flexColumnStyle}>
          <Input
            className="tlui-embed-dialog__input"
            placeholder=""
            label="people-menu.change-name"
            defaultValue={user.name !== null ? user.name : ""}
            autofocus
            onValueChange={(value) => {
              setUsername(value);
            }}
          />
          <Input
            className="tlui-embed-dialog__input"
            placeholder=""
            label="people-menu.change-color"
            defaultValue={user.color !== null ? user.color : ""}
            autofocus
            onValueChange={(value) => {
              setColor(value);
            }}
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
