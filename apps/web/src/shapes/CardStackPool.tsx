import {
  Button,
  Dialog,
  Input,
  TLShapePartial,
  TLUiDialogProps,
  uniqueId,
  useEditor,
} from "@tldraw/tldraw";
import React, { useMemo, useState } from "react";
import {
  currentRoom,
  flexColumnStyle,
  flexRowStyle,
  shuffleArray,
} from "../common";
import {
  FaAlignRight,
  FaAngleRight,
  FaArrowLeft,
  FaArrowRight,
  FaArrowsAlt,
  FaBackspace,
  FaChevronRight,
  FaGreaterThan,
  FaLongArrowAltRight,
  FaTrashAlt,
} from "react-icons/fa";
import { ICardStackShape } from "./CardStackShape";
import { AssetDesc, useAssets } from "../hooks";
import { useAtomValue } from "jotai";
import { assetListStyle } from "../component/AssetList/style.css";
import { AssetItem } from "../component/AssetList/AssetItem";

type Props = TLUiDialogProps & {
  shape: ICardStackShape;
};

export const CardStackPool = ({ shape, onClose }: Props) => {
  const editor = useEditor();
  const [filter, setFilter] = useState("");
  const [pool, setPool] = useState(shape.props.pool);
  const { imageAssets } = useAssets(editor, "");
  const [sel, setSel] = useState<AssetDesc | undefined>(undefined);
  const [poolSel, setPoolSel] = useState<AssetDesc | undefined>(undefined);

  const update = () => {
    const items = [...pool];
    const shapeUpdate: TLShapePartial<ICardStackShape> = {
      id: shape.id,
      type: "rpg-card-stack",
      props: {
        pool: pool,
        current: shuffleArray(items),
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  const addAsset = () => {
    if (!sel) return;
    setPool((prev) => [...prev, { ...sel, id: uniqueId() }]);
  };

  const addAll = () => {
    const its = items.map((asset) => ({ ...asset, id: uniqueId() }));
    setPool((prev) => [...prev, ...its]);
  };

  const removeAsset = () => {
    if (!poolSel) return;
    const newState = pool.filter((it) => it.id !== poolSel.id);
    setPool(newState);
  };

  const items = useMemo(() => {
    return imageAssets.filter(
      (it) => filter.trim() === "" || it.filename.includes(filter)
    );
  }, [imageAssets, filter]);

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Card stack pool</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexRowStyle({})} style={{ alignItems: "start" }}>
          <div className={flexColumnStyle({})} style={{ minWidth: 250 }}>
            <div>Assets</div>
            <div className={assetListStyle}>
              {items.map((it, idx) => (
                <AssetItem
                  key={`${it.filename}-${idx}`}
                  filename={it.filename}
                  onClick={() => setSel(it)}
                  selected={sel?.filename == it.filename}
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
            <div className={flexRowStyle({ justify: "center" })}>
              <Button type="icon" onPointerDown={addAsset}>
                <FaArrowRight size={16} />
              </Button>
              <Button type="icon" onPointerDown={addAll} title="Add all">
                <FaAlignRight size={16} />
              </Button>
            </div>
          </div>
          <div className={flexColumnStyle({})}>
            <div>Pool ({pool.length})</div>
            <div className={assetListStyle} style={{ minWidth: 250 }}>
              {pool.map((it, idx) => (
                <AssetItem
                  key={it.id ? it.id : `${it.filename}-${idx}`}
                  filename={it.filename}
                  onClick={() => setPoolSel(it)}
                  selected={poolSel?.id == it.id}
                />
              ))}
            </div>
            <div className={flexRowStyle({ justify: "center" })}>
              <Button
                type="icon"
                onPointerDown={removeAsset}
                title="Remove item"
              >
                <FaArrowLeft size={16} />
              </Button>
              <Button
                type="icon"
                onPointerDown={() => setPool([])}
                title="Clear pool"
              >
                <FaTrashAlt size={16} />
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
