import {
  Button,
  Dialog,
  Input,
  TLShapePartial,
  TLUiDialogProps,
  useEditor,
} from "@tldraw/tldraw";
import React, { useMemo, useState } from "react";
import { flexColumnStyle, flexRowStyle } from "../common";
import Compact from "@uiw/react-color-compact";
import { FaBackspace, FaUserFriends, FaUserSecret } from "react-icons/fa";
import { ICardStackShape } from "./CardStackShape";
import { assetListStyle } from "../component/AssetList/style.css";
import { AssetItem } from "../component/AssetList/AssetItem";
import { useAssets } from "../hooks";

type Props = TLUiDialogProps & {
  shape: ICardStackShape;
};

export const CardStackSettings = ({ shape, onClose }: Props) => {
  const editor = useEditor();
  const [color, setColor] = useState(
    shape.props.fill ? shape.props.fill : "var(--color-text)"
  );
  const [priv, setPriv] = useState(shape.props.private);
  const [label, setLabel] = useState(shape.props.label);
  const { imageAssets } = useAssets(editor, "");
  const [sel, setSel] = useState(shape.props.cardBack);
  const [filter, setFilter] = useState("");

  const update = () => {
    const shapeUpdate: TLShapePartial<ICardStackShape> = {
      id: shape.id,
      type: "rpg-card-stack",
      props: {
        fill: color,
        private: priv,
        label: label,
        cardBack: sel,
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  const items = useMemo(() => {
    return imageAssets.filter(
      (it) => filter.trim() === "" || it.filename.includes(filter)
    );
  }, [imageAssets, filter]);

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Card stack settings</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexRowStyle({})} style={{ alignItems: "start" }}>
          <div className={flexColumnStyle({})}>
            <div>Label</div>
            <Input
              className="tlui-embed-dialog__input"
              placeholder="Label"
              defaultValue={label}
              onValueChange={(value) => {
                setLabel(value);
              }}
            />
            <div>Color</div>
            <Compact
              style={{ alignSelf: "center" }}
              data-color-mode="dark"
              color={color}
              onChange={(color) => setColor(color.hex)}
            />
            <Button type="normal" onClick={() => setPriv(!priv)}>
              {priv && (
                <div className={flexRowStyle({ justify: "center" })}>
                  <FaUserFriends size={16} fill="var(--color-primary)" />
                  <span>Set as public</span>
                </div>
              )}
              {!priv && (
                <div className={flexRowStyle({ justify: "center" })}>
                  <FaUserSecret size={16} fill="var(--color-accent)" />
                  <span>Set as private</span>
                </div>
              )}
            </Button>
          </div>
          <div className={flexColumnStyle({})} style={{ minWidth: 250 }}>
            <div>Card back asset</div>
            <div
              className={assetListStyle}
              style={{ overflow: "auto", maxHeight: 200 }}
            >
              {items.map((it, idx) => (
                <AssetItem
                  key={`${it}-${idx}`}
                  filename={it.filename}
                  onClick={() => setSel(it.filename)}
                  selected={sel == it.filename}
                />
              ))}
            </div>
            <div className={flexRowStyle({})}>
              <Input
                className="tlui-embed-dialog__input"
                placeholder="Filter..."
                defaultValue={filter}
                onValueChange={(value) => setFilter(value)}
              />
              <Button type="icon" onPointerDown={() => setFilter("")}>
                <FaBackspace size={16} />
              </Button>
            </div>
          </div>
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
