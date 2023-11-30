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
import Compact from "@uiw/react-color-compact";
import { ITimerShape } from "./TimerShape";

type Props = TLUiDialogProps & {
  shape: ITimerShape;
  updateProps: (shape: ITimerShape, remote: boolean) => void;
  getMaxValue: (shape: ITimerShape) => number;
};

export const TimerSettings = (props: Props) => {
  const editor = useEditor();
  const [color, setColor] = useState(
    props.shape.props.color ? props.shape.props.color : "var(--color-text)"
  );
  const [bkg, setBkg] = useState(
    props.shape.props.fill ? props.shape.props.fill : "transparent"
  );
  const [max, setMax] = useState(props.getMaxValue(props.shape).toString());

  const update = () => {
    let m = Number.parseInt(max);
    if (Number.isNaN(m)) m = 0;
    const shapeUpdate: TLShapePartial<ITimerShape> = {
      id: props.shape.id,
      type: "timer",
      props: {
        color: color,
        fill: bkg,
        max: m,
      },
    };
    editor.updateShapes([shapeUpdate]);
    props.onClose();
    const shape = editor.getShape(props.shape.id) as ITimerShape;
    if (shape) props.updateProps(shape, false);
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Timer settings</Dialog.Title>
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
          <div>Maximum value</div>
          <Input
            className="tlui-embed-dialog__input"
            placeholder="Max"
            defaultValue={max}
            onValueChange={(value) => {
              setMax(value);
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
