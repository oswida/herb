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
import { flexColumnStyle, flexRowStyle, shuffleArray } from "../common";
import {
  FaAlignRight,
  FaArrowLeft,
  FaArrowRight,
  FaBackspace,
  FaTrashAlt,
} from "react-icons/fa";
import { AssetDesc, useAssets } from "../hooks";
import { assetListStyle } from "../component/AssetList/style.css";
import { AssetItem } from "../component/AssetList/AssetItem";
import { RpgCardStackShape } from "./CardStackShape";

type Props = TLUiDialogProps & {
  shape: RpgCardStackShape;
};

export const CardStackPool = ({ shape, onClose }: Props) => {
  const editor = useEditor();
  const [filter, setFilter] = useState("");
  const [pool, setPool] = useState(shape.props._pool);
  const { imageAssets } = useAssets(editor, "");
  const [sel, setSel] = useState<AssetDesc[]>([]);
  const [poolSel, setPoolSel] = useState<AssetDesc[]>([]);

  const update = () => {
    const items = [...pool];
    const shapeUpdate: TLShapePartial<RpgCardStackShape> = {
      id: shape.id,
      type: "rpg-card-stack",
      props: {
        _pool: pool,
        _current: shuffleArray(items),
      },
    };
    editor.updateShapes([shapeUpdate]);
    onClose();
  };

  const addAssets = () => {
    if (sel.length === 0) return;
    const newPool = [...pool];
    sel.forEach((a) => {
      newPool.push({ ...a, id: uniqueId() });
    });
    setPool(newPool);
    setSel([]);
  };

  const addAll = () => {
    const its = items.map((asset) => ({ ...asset, id: uniqueId() }));
    setPool((prev) => [...prev, ...its]);
  };

  const removeAssets = () => {
    if (poolSel.length === 0) return;
    const ids = poolSel.map((it) => it.id);
    const newState = pool.filter((it) => !ids.includes(it.id));
    setPool(newState);
    setPoolSel([]);
  };

  const select = (it: AssetDesc) => {
    if (sel.includes(it)) {
      setSel(sel.filter((x) => x.filename !== it.filename));
      return;
    }
    setSel([...sel, it]);
  };

  const selectPool = (it: AssetDesc) => {
    if (poolSel.includes(it)) {
      setPoolSel(poolSel.filter((x) => x.id !== it.id));
      return;
    }
    setPoolSel([...poolSel, it]);
  };

  const items = useMemo(() => {
    return imageAssets
      .filter((it) => filter.trim() === "" || it.filename.includes(filter))
      .sort((a, b) => a.filename.localeCompare(b.filename));
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
                  onClick={() => select(it)}
                  selected={sel.includes(it)}
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
              <Button
                type="icon"
                onPointerDown={addAssets}
                title="Add assets to pool"
              >
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
                  onClick={() => selectPool(it)}
                  selected={poolSel.includes(it)}
                />
              ))}
            </div>
            <div className={flexRowStyle({ justify: "center" })}>
              <Button
                type="icon"
                onPointerDown={removeAssets}
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
