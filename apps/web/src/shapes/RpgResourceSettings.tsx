import {
  Button,
  Dialog,
  Input,
  TLShapePartial,
  TLUiDialogProps,
  useEditor,
} from "@tldraw/tldraw";
import React, { useState } from "react";
import { flexColumnStyle, flexRowStyle } from "../common";
import Compact from "@uiw/react-color-compact";
import { ITimerShape } from "./TimerShape";
import { IRpgResourceShape } from "./RpgResourceShape";
import { FaUserFriends, FaUserSecret } from "react-icons/fa";

type Props = TLUiDialogProps & {
  shape: IRpgResourceShape;
};

export const RpgResourceSettings = ({ shape, onClose }: Props) => {
  const editor = useEditor();
  const [color, setColor] = useState(
    shape.props.color ? shape.props.color : "var(--color-text)"
  );
  const [max, setMax] = useState(shape.props.max);
  const [lbl, setLbl] = useState(shape.props.label);
  const [priv, setPriv] = useState(shape.props.private);

  const update = () => {
    const shapeUpdate: TLShapePartial<IRpgResourceShape> = {
      id: shape.id,
      type: "rpg-resource",
      props: {
        color: color,
        max: max,
        label: lbl,
        private: priv,
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>RPG Resource settings</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})}>
          <div>Fill color</div>
          <Compact
            style={{ alignSelf: "center" }}
            data-color-mode="dark"
            color={color}
            onChange={(color) => setColor(color.hex)}
          />
          <Input
            className="tlui-embed-dialog__input"
            placeholder="Max"
            label={"Maximum value" as any}
            defaultValue={max.toString()}
            onValueChange={(value) => {
              const m = Number.parseInt(value);
              if (!Number.isNaN(m)) setMax(m);
            }}
          />
          <Input
            className="tlui-embed-dialog__input"
            placeholder="Label"
            label={"Label" as any}
            defaultValue={lbl}
            onValueChange={(value) => setLbl(value)}
          />
          <Button type="normal" onClick={() => setPriv(!priv)}>
            {priv && (
              <div className={flexRowStyle({ justify: "center" })}>
                <FaUserFriends size={16} fill="var(--color-primary)" />
                <span>Set as public</span>
              </div>
            )}
            {!priv && (
              <div className={flexRowStyle({ justify: "center" })}>
                <FaUserSecret size={16} fill="var(--color-accent)" />
                <span>Set as private</span>
              </div>
            )}
          </Button>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button type="normal" onClick={update}>
            Save
          </Button>
        </div>
      </Dialog.Footer>
    </>
  );
};
