import {
  TLShapePartial,
  TLUiDialogProps,
  TldrawUiButton,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogFooter,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
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
  const [trigger, setTrigger] = useState(shape.props.triggerInfo);
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
        triggerInfo: trigger,
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Pbta roll info</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody>
        <div className={flexColumnStyle({})} style={{ minWidth: 350 }}>
          <div>Trigger</div>
          <textarea
            rows={4}
            cols={30}
            className="tlui-embed-dialog__input"
            placeholder="Enter description..."
            defaultValue={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            style={{ color: theme.text, whiteSpace: "pre-wrap" }}
          />
          <div>Fail (6-)</div>
          <textarea
            rows={4}
            cols={20}
            className="tlui-embed-dialog__input"
            placeholder="Enter description..."
            defaultValue={info1}
            onChange={(e) => setInfo1(e.target.value)}
            style={{ color: theme.text, whiteSpace: "pre-wrap" }}
          />
          <div>Weak hit (7-9)</div>
          <textarea
            rows={4}
            cols={20}
            className="tlui-embed-dialog__input"
            placeholder="Enter description..."
            defaultValue={info2}
            onChange={(e) => setInfo2(e.target.value)}
            style={{ color: theme.text, whiteSpace: "pre-wrap" }}
          />
          <div>Strong hit (10+)</div>
          <textarea
            rows={4}
            cols={20}
            className="tlui-embed-dialog__input"
            placeholder="Enter description..."
            defaultValue={info3}
            onChange={(e) => setInfo3(e.target.value)}
            style={{ color: theme.text, whiteSpace: "pre-wrap" }}
          />
        </div>
      </TldrawUiDialogBody>
      <TldrawUiDialogFooter>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <TldrawUiButton type="normal" onClick={update}>
            Save
          </TldrawUiButton>
        </div>
      </TldrawUiDialogFooter>
    </>
  );
});
