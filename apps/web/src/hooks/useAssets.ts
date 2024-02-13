import { useQuery } from "@tanstack/react-query";
import {
  AssetRecordType,
  Editor,
  MediaHelpers,
  TLImageShape,
  TLShapeId,
  createShapeId,
  getHashForString,
  uniqueId,
} from "@tldraw/tldraw";
import { useCallback, useEffect, useMemo } from "react";
import { currentRoom, isImage, isMarkdown, isPdf } from "../common";
import { IPdfShape, MarkdownShape } from "../shapes";
import { useAtomValue } from "jotai";

type AssetType = "image" | "pdf" | "handout";
const port = import.meta.env.DEV ? 5001 : window.location.port;
const UPLOAD_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/upload`;
const ASSET_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${port}/api/asset`;

export interface AssetDesc {
  id?: string; // used for asset pool
  filename: string;
  mime: string;
}

export const useAssets = (editor: Editor, filter: string) => {
  const roomId = useAtomValue(currentRoom);
  const { data: imageData, refetch: imageRefetch } = useQuery({
    queryKey: ["assetList"],
    queryFn: () =>
      fetch(`${ASSET_BASE_URL}/image/${roomId}/asset-list`, {
        method: "GET",
      }).then((res) => res.json()),
    networkMode: "online",
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    imageRefetch().then(() => {});
  }, [roomId, filter]);

  const imageAssets = useMemo(() => {
    if (!imageData) return [];
    return (imageData as AssetDesc[]).filter(
      (it) => filter === "" || it.filename.includes(filter)
    );
  }, [imageData, filter]);

  const getImageAssetData = useCallback(
    async (filenames: string[]) => {
      const retv: { url: string; size: { w: number; h: number } }[] = [];
      for (let i = 0; i < filenames.length; i++) {
        if (filenames[i].trim() === "") continue;
        const url = `${UPLOAD_BASE_URL}/image/${roomId}/${filenames[i]}`;
        const img = await MediaHelpers.loadImage(url);
        const value = { w: img.width, h: img.height };
        retv.push({ size: value, url: url });
      }
      return retv;
    },
    [roomId]
  );

  const insertAsset = useCallback(
    async (asset: AssetDesc) => {
      if (!editor) {
        return;
      }
      if (!isImage(asset.mime) && !isPdf(asset.mime) && !isMarkdown(asset.mime))
        return;
      const atype = isImage(asset.mime)
        ? "image"
        : isPdf(asset.mime)
        ? "pdf"
        : "handout";
      const url = `${UPLOAD_BASE_URL}/${atype}/${roomId}/${asset.filename}`;
      const aid = AssetRecordType.createId(getHashForString(url));
      const center = { x: 800, y: 500 };
      const sid: TLShapeId = createShapeId(uniqueId());

      switch (atype) {
        case "image":
          {
            const img = await MediaHelpers.loadImage(url);
            editor.createShapes<TLImageShape>([
              {
                id: sid,
                type: "image",
                x: center.x - img.width / 2,
                y: center.y - img.height / 2,
                props: {
                  w: img.width,
                  h: img.height,
                  assetId: aid,
                },
              },
            ]);
          }
          break;
        case "pdf":
          editor.createShape<IPdfShape>({
            id: sid,
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
          editor.createShape<MarkdownShape>({
            id: sid,
            type: "rpg-markdown",
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
      return sid;
    },
    [editor, roomId]
  );

  return { imageAssets, insertAsset, getImageAssetData };
};
