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
import { IDiceRollerShape } from "./DiceRollerShape";

type Props = TLUiDialogProps & {
  shape: IDiceRollerShape;
};

export const DiceRollerPool = ({ shape, onClose }: Props) => {
  const [d6white, setD6White] = useState(
    shape.props.pool["dTl"] ? shape.props.pool["dTl"] : 0
  );
  const [d6black, setD6Black] = useState(
    shape.props.pool["dTd"] ? shape.props.pool["dTd"] : 0
  );
  const [d4, setD4] = useState(
    shape.props.pool["d4"] ? shape.props.pool["d4"] : 0
  );
  const [d8, setD8] = useState(
    shape.props.pool["d8"] ? shape.props.pool["d8"] : 0
  );
  const [d10, setD10] = useState(
    shape.props.pool["d10"] ? shape.props.pool["d10"] : 0
  );
  const [d12, setD12] = useState(
    shape.props.pool["d12"] ? shape.props.pool["d12"] : 0
  );
  const editor = useEditor();

  const update = () => {
    const pool: Record<string, number> = {};
    if (!Number.isNaN(d6white) && d6white > 0) {
      pool["dTl"] = d6white;
    }
    if (!Number.isNaN(d6black) && d6black > 0) {
      pool["dTd"] = d6black;
    }
    if (!Number.isNaN(d4) && d4 > 0) {
      pool["d4"] = d4;
    }
    if (!Number.isNaN(d8) && d8 > 0) {
      pool["d8"] = d8;
    }
    if (!Number.isNaN(d10) && d10 > 0) {
      pool["d10"] = d10;
    }
    if (!Number.isNaN(d12) && d12 > 0) {
      pool["d12"] = d12;
    }
    const shapeUpdate: TLShapePartial<IDiceRollerShape> = {
      id: shape.id,
      type: "rpg-dice-roller",
      props: {
        pool: pool,
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Dice roller pool</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})}>
          <Input
            className="tlui-embed-dialog__input"
            placeholder="number of white d6 dice"
            label={"d6 white" as any}
            defaultValue={d6white.toString()}
            onValueChange={(value: string) =>
              setD6White(Number.parseInt(value))
            }
          />
          <Input
            className="tlui-embed-dialog__input"
            placeholder="number of black d6 dice"
            label={"d6 black" as any}
            defaultValue={d6black.toString()}
            onValueChange={(value: string) =>
              setD6Black(Number.parseInt(value))
            }
          />
          <Input
            className="tlui-embed-dialog__input"
            placeholder="number of d4 dice"
            label={"d4" as any}
            defaultValue={d4.toString()}
            onValueChange={(value: string) => setD4(Number.parseInt(value))}
          />
          <Input
            className="tlui-embed-dialog__input"
            placeholder="number of d8 dice"
            label={"d8" as any}
            defaultValue={d8.toString()}
            onValueChange={(value: string) => setD8(Number.parseInt(value))}
          />
          <Input
            className="tlui-embed-dialog__input"
            placeholder="number of d10 dice"
            label={"d10" as any}
            defaultValue={d10.toString()}
            onValueChange={(value: string) => setD10(Number.parseInt(value))}
          />
          <Input
            className="tlui-embed-dialog__input"
            placeholder="number of d12 dice"
            label={"d12" as any}
            defaultValue={d12.toString()}
            onValueChange={(value: string) => setD12(Number.parseInt(value))}
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
