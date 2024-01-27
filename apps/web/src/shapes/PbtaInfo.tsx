import {
  Button,
  Dialog,
  TLShapePartial,
  TLUiDialogProps,
  getDefaultColorTheme,
  track,
  useEditor,
} from "@tldraw/tldraw";
import React, { useState } from "react";
import { flexColumnStyle } from "../common";
import { RpgPbtaRollShape } from "./RpgPbtaRollShape";

type Props = TLUiDialogProps & {
  shape: RpgPbtaRollShape;
};

export const PbtaInfo = track(({ shape, onClose }: Props) => {
  const editor = useEditor();
  const [info1, setInfo1] = useState(shape.props.rollInfo1);
  const [info2, setInfo2] = useState(shape.props.rollInfo2);
  const [info3, setInfo3] = useState(shape.props.rollInfo3);
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });

  const update = () => {
    const shapeUpdate: TLShapePartial<RpgPbtaRollShape> = {
      id: shape.id,
      type: "rpg-pbta-roll",
      props: {
        rollInfo1: info1,
        rollInfo2: info2,
        rollInfo3: info3,
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Pbta roll info</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})} style={{ minWidth: 250 }}>
          <div>Fail (6-)</div>
          <textarea
            rows={5}
            cols={15}
            className="tlui-embed-dialog__input"
            placeholder="Fail roll (6-)"
            defaultValue={info1}
            onChange={(e) => setInfo1(e.target.value)}
            style={{ color: theme.text }}
          />
          <div>Weak hit (7-9)</div>
          <textarea
            rows={5}
            cols={15}
            className="tlui-embed-dialog__input"
            placeholder="Weak hit roll (7-9)"
            defaultValue={info2}
            onChange={(e) => setInfo2(e.target.value)}
            style={{ color: theme.text }}
          />
          <div>Strong hit (10+)</div>
          <textarea
            rows={5}
            cols={15}
            className="tlui-embed-dialog__input"
            placeholder="Strong hit roll (10+)"
            defaultValue={info3}
            onChange={(e) => setInfo3(e.target.value)}
            style={{ color: theme.text }}
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
});
