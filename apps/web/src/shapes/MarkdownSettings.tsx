import {
  Button,
  Dialog,
  TLShapePartial,
  TLUiDialogProps,
  shapeIdValidator,
  useEditor,
} from "@tldraw/tldraw";
import React, { useState } from "react";
import { flexColumnStyle, flexRowStyle } from "../common";
import { IMarkdownShape } from "./MarkdownShape";
import Compact from "@uiw/react-color-compact";
import { FaUserFriends, FaUserSecret } from "react-icons/fa";

type Props = TLUiDialogProps & {
  shape: IMarkdownShape;
};

export const MarkdownSettings = ({ shape, onClose }: Props) => {
  const editor = useEditor();
  const [color, setColor] = useState(
    shape.props.color ? shape.props.color : "var(--color-text)"
  );
  const [bkg, setBkg] = useState(
    shape.props.fill ? shape.props.fill : "transparent"
  );
  const [priv, setPriv] = useState(shape.props.private);

  const update = () => {
    const shapeUpdate: TLShapePartial<IMarkdownShape> = {
      id: shape.id,
      type: "markdown",
      props: {
        color: color,
        fill: bkg,
        private: priv,
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Markdown settings</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})}>
          <div>Background color</div>
          <Compact
            style={{ alignSelf: "center" }}
            data-color-mode="dark"
            color={bkg}
            onChange={(color) => setBkg(color.hex)}
          />
          <Button type="normal" onClick={() => setBkg("transparent")}>
            Transparent
          </Button>
          <div>Text color</div>
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
