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
  const editor = useEditor();
  // const [color, setColor] = useState(
  //   shape.props.color ? shape.props.color : "var(--color-text)"
  // );
  // const [bkg, setBkg] = useState(
  //   shape.props.fill ? shape.props.fill : "transparent"
  // );
  // const [priv, setPriv] = useState(shape.props.private);

  const update = () => {
    const pool: Record<string, number> = {};
    if (!Number.isNaN(d6white) && d6white > 0) {
      pool["dTl"] = d6white;
    }
    if (!Number.isNaN(d6black) && d6black > 0) {
      pool["dTd"] = d6black;
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
