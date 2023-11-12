import {
  Button,
  Dialog,
  Input,
  TLShapePartial,
  TLUiDialogProps,
  useEditor,
} from "@tldraw/tldraw";
import React, { useState } from "react";
import { flexColumnStyle } from "../common";
import { IRpgClockShape } from "./RpgClockShape";

type Props = TLUiDialogProps & {
  shape: IRpgClockShape;
};

export const RpgClockSettings = (props: Props) => {
  const [parts, setParts] = useState(props.shape.props.parts);
  const [label, setLabel] = useState(props.shape.props.label);

  const editor = useEditor();
  const update = () => {
    const shapeUpdate: TLShapePartial<IRpgClockShape> = {
      id: props.shape.id,
      type: "rpg-clock",
      props: {
        count: 0,
        parts: parts,
        label: label,
      },
    };
    console.log(shapeUpdate);
    editor.updateShapes([shapeUpdate]);
    props.onClose();
  };

  const updateParts = (value: string) => {
    let num = Number.parseInt(value);
    if (num === Number.NaN) return;
    setParts(num);
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Clock settings</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})}>
          <div>Size</div>
          <Input
            className="tlui-embed-dialog__input"
            placeholder="Clock parts"
            defaultValue={`${props.shape.props.parts}`}
            autofocus
            onValueChange={(value) => {
              updateParts(value);
            }}
          />

          <div>Label</div>
          <Input
            className="tlui-embed-dialog__input"
            placeholder="Label"
            defaultValue={`${props.shape.props.label}`}
            autofocus
            onValueChange={(value) => {
              setLabel(value);
            }}
          />
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
