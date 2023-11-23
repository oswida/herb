/* eslint-disable @typescript-eslint/explicit-function-return-type -- comment */
import type { Editor, TLAsset, TLAssetId } from "@tldraw/tldraw";
import {
  AssetRecordType,
  MediaHelpers,
  getHashForString,
  isGifAnimated,
} from "@tldraw/tldraw";
import { UPLOAD_BASE_URL, generateSerialKeys } from "../common";

export const useAssetHandler = (roomId: string) => {
  const registerHostedImages = (editor: Editor) => {
    editor.registerExternalAssetHandler(
      "file",
      async ({ file }: { type: "file"; file: File }) => {
        const id = generateSerialKeys(6, "-");

        const objectName = `${id}-${file.name}`.replaceAll(
          /[^a-zA-Z0-9.]/g,
          "-"
        );
        const url = `${UPLOAD_BASE_URL}/image/${roomId}/${objectName}`;

        await fetch(url, {
          method: "POST",
          body: file,
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
          ["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(
            file.type
          )
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
