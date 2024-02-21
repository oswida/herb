import {
  TLUiDialogProps,
  TldrawUiButton,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogFooter,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  TldrawUiInput,
  getUserPreferences,
  setUserPreferences,
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
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Settings</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody>
        <div className={flexColumnStyle({})}>
          <div>Name</div>
          <TldrawUiInput
            className="tlui-embed-dialog__input"
            placeholder=""
            defaultValue={user.name !== null ? user.name : ""}
            autofocus
            onValueChange={(value) => {
              setUsername(value);
            }}
          />
          <div>Color</div>
          <Compact
            style={{ alignSelf: "center" }}
            data-color-mode="dark"
            color={color}
            onChange={(color) => setColor(color.hex)}
          />
        </div>
      </TldrawUiDialogBody>
      <TldrawUiDialogFooter>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <TldrawUiButton onPointerDown={update} type="normal">
            Save
          </TldrawUiButton>
        </div>
      </TldrawUiDialogFooter>
    </>
  );
};
