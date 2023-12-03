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
};

export const TimerSettings = ({ shape, onClose }: Props) => {
  const editor = useEditor();
  const [color, setColor] = useState(
    shape.props.color ? shape.props.color : "var(--color-text)"
  );
  const [bkg, setBkg] = useState(
    shape.props.fill ? shape.props.fill : "transparent"
  );
  const [max, setMax] = useState(shape.props.max);
  const [lbl, setLbl] = useState(shape.props.label);

  const update = () => {
    const shapeUpdate: TLShapePartial<ITimerShape> = {
      id: shape.id,
      type: "timer",
      props: {
        color: color,
        fill: bkg,
        max: max,
        label: lbl,
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
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
