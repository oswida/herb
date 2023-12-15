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
import Compact from "@uiw/react-color-compact";
import useLocalStorage from "use-local-storage";

export const Settings = (props: TLUiDialogProps) => {
  const user = getUserPreferences();
  const [username, setUsername] = useState(user.name);
  const [color, setColor] = useState(user.color ? user.color : "#000000");
  const [diceColor, setDiceColor] = useLocalStorage(
    "herbDiceColor",
    "necrotic"
  );
  const [diceMaterial, setDiceMaterial] = useLocalStorage(
    "herbDiceMaterial",
    "plastic"
  );
  const [animateDice, setDiceAnimate] = useLocalStorage(
    "herbDiceAnimate",
    "true"
  );

  const allowedDiceColors = [
    "bloodmoon",
    "necrotic",
    "white",
    "black",
    "bronze",
    "dragons",
    "fire",
  ];

  const allowedDiceMaterials = ["plastic", "metal", "glass", "wood"];

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
          <Button
            onPointerDown={() =>
              setDiceAnimate(animateDice === "true" ? "false" : "true")
            }
            type="normal"
          >
            Dice animation {animateDice === "true" ? "ON" : "OFF"}
          </Button>
          {animateDice === "true" && (
            <>
              <div>Dice color</div>
              <div style={{ color: "var(--color-accent)" }}>
                {" "}
                {allowedDiceColors.join(",")}
              </div>
              <Input
                className="tlui-embed-dialog__input"
                placeholder=""
                defaultValue={diceColor}
                onValueChange={(value) => {
                  if (allowedDiceColors.includes(value)) setDiceColor(value);
                }}
              />
              <div>Dice material</div>
              <div style={{ color: "var(--color-accent)" }}>
                {" "}
                {allowedDiceMaterials.join(",")}
              </div>
              <Input
                className="tlui-embed-dialog__input"
                placeholder=""
                defaultValue={diceMaterial}
                onValueChange={(value) => {
                  if (allowedDiceMaterials.includes(value))
                    setDiceMaterial(value);
                }}
              />
            </>
          )}
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button onPointerDown={update} type="normal">
            Save
          </Button>
        </div>
      </Dialog.Footer>
    </>
  );
};
