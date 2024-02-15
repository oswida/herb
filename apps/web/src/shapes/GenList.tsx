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
  const [items, setItems] = useState(shape.props.items);
  const [items2, setItems2] = useState(shape.props.items_second);
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });

  const update = () => {
    const shapeUpdate: TLShapePartial<RpgGenShape> = {
      id: shape.id,
      type: "rpg-gen",
      props: {
        items: items,
        items_second: items2,
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
          <div>Item list (each line is a single item)</div>
          <textarea
            rows={10}
            cols={30}
            className="tlui-embed-dialog__input"
            placeholder="Enter description..."
            defaultValue={items.join("\n")}
            onChange={(e) => setItems(e.target.value.split("\n"))}
            style={{ color: theme.text, whiteSpace: "pre-wrap" }}
          />
          {shape.props.pairs && (
            <>
              <div>Second item list (each line is a single item)</div>
              <textarea
                rows={10}
                cols={30}
                className="tlui-embed-dialog__input"
                placeholder="Enter description..."
                defaultValue={items2.join("\n")}
                onChange={(e) => setItems2(e.target.value.split("\n"))}
                style={{ color: theme.text, whiteSpace: "pre-wrap" }}
              />
            </>
          )}
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
