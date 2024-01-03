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
import { FaUserFriends, FaUserSecret } from "react-icons/fa";
import { ICardStackShape } from "./CardStackShape";

type Props = TLUiDialogProps & {
  shape: ICardStackShape;
};

export const CardStackSettings = ({ shape, onClose }: Props) => {
  const editor = useEditor();
  const [color, setColor] = useState(
    shape.props.fill ? shape.props.fill : "var(--color-text)"
  );
  const [priv, setPriv] = useState(shape.props.private);
  const [label, setLabel] = useState(shape.props.label);

  const update = () => {
    const shapeUpdate: TLShapePartial<ICardStackShape> = {
      id: shape.id,
      type: "rpg-card-stack",
      props: {
        fill: color,
        private: priv,
        label: label,
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Card stack settings</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})}>
          <div>Label</div>
          <Input
            className="tlui-embed-dialog__input"
            placeholder="Label"
            defaultValue={label}
            onValueChange={(value) => {
              setLabel(value);
            }}
          />
          <div>Color</div>
          <Compact
            style={{ alignSelf: "center" }}
            data-color-mode="dark"
            color={color}
            onChange={(color) => setColor(color.hex)}
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
