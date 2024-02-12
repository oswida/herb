/* eslint-disable @typescript-eslint/explicit-function-return-type -- comment */
import type { Editor, TLAsset, TLAssetId, TLUiToast } from "@tldraw/tldraw";
import {
  AssetRecordType,
  MediaHelpers,
  getHashForString,
  isGifAnimated,
} from "@tldraw/tldraw";
import { generateSerialKeys, globalErr } from "../common";
import { useSetAtom } from "jotai";

export const useAssetHandler = (roomId: string, baseUrl: string) => {
  const setGlobalErr = useSetAtom(globalErr);

  const registerHostedImages = (editor: Editor) => {
    editor.registerExternalAssetHandler(
      "file",
      async ({ file }: { type: "file"; file: File }) => {
        const id = generateSerialKeys(6, "-");
        const parts = file.name.split(".");
        parts.splice(1, 0, id);
        const fname = parts.join(".");
        const objectName = `${fname}`.replaceAll(/[^a-zA-Z0-9.]/g, "-");
        const url = `${baseUrl}/image/${roomId}/${objectName}`;

        await fetch(url, {
          method: "POST",
          body: file,
        })
          .then((resp) => {
            if (!resp.ok) {
              setGlobalErr(
                "Cannot upload file. It is possible that this room has reached upload limit."
              );
              return;
            }
          })
          .catch((err) => {
            setGlobalErr(
              "Cannot upload file. It is possible that this room has reached upload limit."
            );
            return;
          });

        const assetId: TLAssetId = AssetRecordType.createId(
          getHashForString(url)
        );

        let size: {
          w: number;
          h: number;
        };
        let isAnimated: boolean;
        let shapeType: "image" | "video";

        if (
          [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/svg+xml",
          ].includes(file.type)
        ) {
          shapeType = "image";
          size = await MediaHelpers.getImageSizeFromSrc(url);
          isAnimated = file.type === "image/gif" && (await isGifAnimated(file));
        } else {
          shapeType = "video";
          isAnimated = true;
          size = await MediaHelpers.getVideoSizeFromSrc(url);
        }

        const asset: TLAsset = AssetRecordType.create({
          id: assetId,
          type: shapeType,
          typeName: "asset",
          props: {
            name: file.name,
            src: url,
            w: size.w,
            h: size.h,
            mimeType: file.type,
            isAnimated,
          },
        });

        return asset;
      }
    );
  };

  return { registerHostedImages };
};
