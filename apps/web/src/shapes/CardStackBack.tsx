import {
  TLShapePartial,
  TLUiDialogProps,
  TldrawUiButton,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogFooter,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  TldrawUiInput,
  useEditor,
} from "@tldraw/tldraw";
import React, { useMemo, useState } from "react";
import { flexColumnStyle, flexRowStyle } from "../common";
import { FaBackspace } from "react-icons/fa";
import { assetListStyle } from "../component/AssetList/style.css";
import { AssetItem } from "../component/AssetList/AssetItem";
import { useAssets } from "../hooks";
import { RpgCardStackShape } from "./RpgCardStackShape";

type Props = TLUiDialogProps & {
  shape: RpgCardStackShape;
};

export const CardStackBack = ({ shape, onClose }: Props) => {
  const editor = useEditor();
  const { imageAssets, getImageAssetData } = useAssets(editor, "");
  const [sel, setSel] = useState(shape.props._cardBack);
  const [filter, setFilter] = useState("");

  const update = () => {
    getImageAssetData([sel]).then((data) => {
      if (data.length === 0) return;
      const shapeUpdate: TLShapePartial<RpgCardStackShape> = {
        id: shape.id,
        type: "rpg-card-stack",
        props: {
          _cardBack: sel,
          _cardBackUrl: data[0].url,
          w: data[0].size.w,
          h: data[0].size.h,
        },
      };
      editor.updateShapes([shapeUpdate]);
      onClose();
    });
  };

  const items = useMemo(() => {
    return imageAssets
      .filter((it) => filter.trim() === "" || it.filename.includes(filter))
      .sort((a, b) => a.filename.localeCompare(b.filename));
  }, [imageAssets, filter]);

  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Card stack back image</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody>
        <div className={flexColumnStyle({})} style={{ minWidth: 250 }}>
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
            <TldrawUiInput
              className="tlui-embed-dialog__input"
              placeholder="Filter..."
              defaultValue={filter}
              onValueChange={(value) => setFilter(value)}
            />
            <TldrawUiButton type="icon" onPointerDown={() => setFilter("")}>
              <FaBackspace size={16} />
            </TldrawUiButton>
          </div>
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
};
