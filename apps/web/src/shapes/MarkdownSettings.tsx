import {
  Button,
  Dialog,
  TLShapePartial,
  TLUiDialogProps,
  useEditor,
} from "@tldraw/tldraw";
import React, { useState } from "react";
import { flexColumnStyle } from "../common";
import { IMarkdownShape } from "./MarkdownShape";
import Compact from "@uiw/react-color-compact";

type Props = TLUiDialogProps & {
  shape: IMarkdownShape;
};

export const MarkdownSettings = (props: Props) => {
  const editor = useEditor();
  const [color, setColor] = useState(
    props.shape.props.color ? props.shape.props.color : "var(--color-text)"
  );
  const [bkg, setBkg] = useState(
    props.shape.props.fill ? props.shape.props.fill : "transparent"
  );

  const update = () => {
    const shapeUpdate: TLShapePartial<IMarkdownShape> = {
      id: props.shape.id,
      type: "markdown",
      props: {
        color: color,
        fill: bkg,
      },
    };
    editor.updateShapes([shapeUpdate]);
    props.onClose();
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
          <div>Private</div>
          <Button type="icon"></Button>
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
