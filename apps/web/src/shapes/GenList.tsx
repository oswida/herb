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
import { RpgGenShape } from "./GeneratorShape";

type Props = TLUiDialogProps & {
  shape: RpgGenShape;
};

export const GenList = track(({ shape, onClose }: Props) => {
  const editor = useEditor();
  const [items, setItems] = useState(
    shape.props.items.map((it) => it.join("\n")).join("\n---\n")
  );
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });

  const update = () => {
    const shapeUpdate: TLShapePartial<RpgGenShape> = {
      id: shape.id,
      type: "rpg-gen",
      props: {
        items: items.split("\n---\n").map((it) => it.split("\n")),
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Generator items</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})} style={{ minWidth: 350 }}>
          <div>
            Item list. <br />
            Each line is a single item.
            <br />
            You can separate item categories by line <br />
            starting with at least three minuses (---).
          </div>
          <textarea
            rows={20}
            cols={40}
            className="tlui-embed-dialog__input"
            placeholder="Enter description..."
            defaultValue={items}
            onChange={(e) => setItems(e.target.value)}
            style={{ color: theme.text, whiteSpace: "pre-wrap" }}
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
