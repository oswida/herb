import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ASSET_BASE_URL,
  ASSET_LIST_BASE_URL,
  UPLOAD_BASE_URL,
  assetListVisible,
  flexRowStyle,
} from "../../common";
import { assetListRootStyle, assetListStyle } from "./style.css";
import { useAtomValue } from "jotai";
import { AssetItem } from "./AssetItem";
import {
  AssetRecordType,
  Button,
  Input,
  MediaHelpers,
  TLImageShape,
  getHashForString,
  useDialogs,
  useEditor,
} from "@tldraw/tldraw";
import { FaBackspace, FaReply } from "react-icons/fa";
import { IPdfShape } from "../../shapes";
import { Confirmation } from "../Confirmation";

type AssetDesc = {
  filename: string;
  mime: string;
};

type TabType = "Image" | "PDF" | "Handout";

export const AssetList = () => {
  const [data, setData] = useState<AssetDesc[]>([]);
  const visible = useAtomValue(assetListVisible);
  const [filter, setFilter] = useState("");
  const filterRef = useRef<HTMLInputElement>();
  const [sel, setSel] = useState<AssetDesc | undefined>(undefined);
  const editor = useEditor();
  const [tab, setTab] = useState<TabType>("Image");
  const tabs: TabType[] = ["Image", "PDF", "Handout"];
  const { addDialog } = useDialogs();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const filterChange = async (value: string) => {
    setFilter(value);
  };

  useEffect(() => {
    fetch(`${ASSET_LIST_BASE_URL}/${tab.toLowerCase()}`, {
      method: "GET",
    }).then((res) => {
      res.json().then((j) => {
        const json = j as AssetDesc[];
        setData(
          json.filter(
            (it) => filter.trim() == "" || it.filename.includes(filter)
          )
        );
      });
    });
  }, [tab, filter, refreshTrigger]);

  const clearFilter = async () => {
    setFilter("");
    if (filterRef.current) filterRef.current.value = "";
  };

  const isImage = (mime: string) => {
    return ["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(
      mime
    );
  };

  const isPdf = (mime: string) => {
    return ["application/pdf"].includes(mime);
  };

  const insertAsset = useCallback(
    async (asset: AssetDesc) => {
      if (!editor) {
        return;
      }
      if (!isImage(asset.mime) && !isPdf(asset.mime)) return;
      const atype = isImage(asset.mime)
        ? "image"
        : isPdf(asset.mime)
        ? "pdf"
        : "undefined";
      const url = `${UPLOAD_BASE_URL}/${atype}/${asset.filename}`;
      const aid = AssetRecordType.createId(getHashForString(url));
      const center = { x: 800, y: 500 };

      switch (atype) {
        case "image":
          {
            const size = await MediaHelpers.getImageSizeFromSrc(url);
            editor.createShapes<TLImageShape>([
              {
                type: "image",
                x: center.x - size.w / 2,
                y: center.y - size.h / 2,
                props: {
                  w: size.w,
                  h: size.h,
                  assetId: aid,
                },
              },
            ]);
          }
          break;
        case "pdf":
          editor.createShape<IPdfShape>({
            type: "pdf",
            x: center.x - 250,
            y: center.y - 150,
            props: {
              pdf: url,
              w: 500,
              h: 300,
            },
          });
          break;
      }
    },
    [editor]
  );

  const deleteAsset = (asset: AssetDesc | undefined) => {
    if (!asset) return;
    addDialog({
      component: ({ onClose }) => (
        <Confirmation
          onClose={onClose}
          title="Delete asset"
          message={`Delete ${asset.filename}? \nPlease be aware, that all objects\npointing to this asset will be broken.`}
          callback={() => {
            fetch(`${ASSET_BASE_URL}/${asset.filename}/${tab.toLowerCase()}`, {
              method: "DELETE",
            }).then((r) => {
              console.log("Set tab");
              setTab("PDF");
            });
            onClose();
          }}
        />
      ),
      onClose: () => {
        void null;
      },
    });
  };

  const refresh = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  if (!visible) return null;

  return (
    <div className={assetListRootStyle}>
      <div
        style={{ padding: "2px 5px", gap: "10px" }}
        className={flexRowStyle({ justify: "center" })}
      >
        {tabs.map((it) => (
          <div
            onClick={() => setTab(it)}
            key={it}
            style={{
              color: it === tab ? "var(--color-accent)" : "var(--color-text)",
              cursor: "pointer",
            }}
          >
            {it}
          </div>
        ))}
      </div>

      <div className={flexRowStyle({})}>
        <Input
          className="tlui-embed-dialog__input"
          placeholder="Filter..."
          defaultValue={filter}
          ref={filterRef as any}
          onValueChange={(value) => filterChange(value)}
        />
        <Button type="icon" onClick={clearFilter}>
          <FaBackspace size={16} />
        </Button>
      </div>
      <div className={assetListStyle}>
        {data.map((it, idx) => (
          <AssetItem
            key={`${it.filename}-${idx}`}
            filename={it.filename}
            onClick={() => setSel(it)}
            selected={sel?.filename == it.filename}
          />
        ))}
      </div>
      <div
        className={flexRowStyle({ justify: "center" })}
        style={{ gap: "10px" }}
      >
        <Button
          type="normal"
          onClick={() => (sel ? insertAsset(sel) : undefined)}
        >
          Insert
        </Button>
        <Button type="normal" onClick={async () => await deleteAsset(sel)}>
          Delete
        </Button>
        <Button type="icon" onClick={refresh}>
          <FaReply />
        </Button>

        {/* <div style={{ paddingRight: "10px" }}>
                {sel && isImage(sel.mime) && (
                    <img src={`${UPLOAD_URL}/${sel?.filename}`} style={{ height: "100px" }} />
                )}
            </div> */}
      </div>
    </div>
  );
};
