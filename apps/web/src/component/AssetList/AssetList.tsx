import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  assetFilter,
  assetListVisible,
  flexRowStyle,
  isImage,
  isMarkdown,
  isPdf,
} from "../../common";
import { assetListRootStyle, assetListStyle } from "./style.css";
import { useAtom, useAtomValue } from "jotai";
import { AssetItem } from "./AssetItem";
import {
  AssetRecordType,
  Button,
  Input,
  MediaHelpers,
  TLImageShape,
  getHashForString,
  stopEventPropagation,
  track,
  useDialogs,
  useEditor,
} from "@tldraw/tldraw";
import { FaBackspace } from "react-icons/fa";
import { IMarkdownShape, IPdfShape } from "../../shapes";
import { Confirmation } from "../Confirmation";
import { useQuery } from "@tanstack/react-query";

type AssetDesc = {
  filename: string;
  mime: string;
};

type TabType = "Image" | "PDF" | "Handout";
const port = import.meta.env.DEV ? 5001 : window.location.port;
const UPLOAD_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/upload`;
const ASSET_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/asset`;

export const AssetList = ({ roomId }: { roomId: string }) => {
  const visible = useAtomValue(assetListVisible);
  const [filter, setFilter] = useAtom(assetFilter);
  const [sel, setSel] = useState<AssetDesc[]>([]);
  const editor = useEditor();
  const [tab, setTab] = useState<TabType>("Image");
  const tabs: TabType[] = ["Image", "PDF", "Handout"];
  const { addDialog } = useDialogs();

  const { data, refetch } = useQuery({
    queryKey: ["assetList"],
    queryFn: () =>
      fetch(`${ASSET_BASE_URL}/${tab.toLowerCase()}/${roomId}/asset-list`, {
        method: "GET",
      }).then((res) => res.json()),
    networkMode: "online",
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (!visible) return;
    refetch().then(() => {});
  }, [tab, filter, visible]);

  const items = useMemo(() => {
    if (!data) return [];
    return (data as AssetDesc[])
      .filter((it) => filter === "" || it.filename.includes(filter))
      .sort((a, b) => a.filename.localeCompare(b.filename));
  }, [data, filter]);

  const filterChange = async (value: string) => {
    setFilter(value);
  };

  const clearFilter = async () => {
    setFilter("");
  };

  const insertAsset = useCallback(
    async (assets: AssetDesc[]) => {
      if (!editor) {
        return;
      }
      assets.forEach(async (asset) => {
        if (
          !isImage(asset.mime) &&
          !isPdf(asset.mime) &&
          !isMarkdown(asset.mime)
        )
          return;
        const atype = isImage(asset.mime)
          ? "image"
          : isPdf(asset.mime)
          ? "pdf"
          : "handout";
        const url = `${UPLOAD_BASE_URL}/${atype}/${roomId}/${asset.filename}`;
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
          case "handout":
            editor.createShape<IMarkdownShape>({
              type: "markdown",
              x: center.x - 250,
              y: center.y - 150,
              props: {
                url: url,
                w: 500,
                h: 300,
              },
            });
            break;
        }
      });
    },
    [editor]
  );

  const deleteAsset = (assets: AssetDesc[]) => {
    if (assets.length === 0) return;
    addDialog({
      component: ({ onClose }) => (
        <Confirmation
          onClose={onClose}
          title="Delete asset"
          message={`Delete selected assets? \nPlease be aware, that all objects\npointing to these assets will be broken.`}
          callback={async () => {
            assets.forEach(async (a) => {
              await fetch(
                `${ASSET_BASE_URL}/${tab.toLowerCase()}/${roomId}/${
                  a.filename
                }`,
                {
                  method: "DELETE",
                }
              );
            });
            onClose();
            await refetch();
          }}
        />
      ),
      onClose: () => {
        void null;
      },
    });
  };

  const select = (it: AssetDesc) => {
    if (sel.includes(it)) {
      setSel(sel.filter((x) => x.filename !== it.filename));
      return;
    }
    setSel([...sel, it]);
  };

  if (!visible) return null;

  return (
    <div
      className={assetListRootStyle}
      onWheelCapture={stopEventPropagation}
      onPointerDown={stopEventPropagation}
      onPointerUp={stopEventPropagation}
    >
      <div
        style={{ padding: "2px 5px", gap: "10px" }}
        className={flexRowStyle({ justify: "center" })}
      >
        {tabs.map((it) => (
          <div
            onPointerDown={() => setTab(it)}
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
          onValueChange={(value) => filterChange(value)}
        />
        <Button type="icon" onPointerDown={clearFilter}>
          <FaBackspace size={16} />
        </Button>
      </div>
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
      <div
        className={flexRowStyle({ justify: "center" })}
        style={{ gap: "10px" }}
      >
        <Button
          type="normal"
          onPointerDown={() => (sel ? insertAsset(sel) : undefined)}
        >
          Insert
        </Button>
        <Button type="normal" onPointerDown={() => deleteAsset(sel)}>
          Delete
        </Button>
      </div>
    </div>
  );
};
