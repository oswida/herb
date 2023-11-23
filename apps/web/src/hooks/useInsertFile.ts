/* eslint-disable @typescript-eslint/explicit-function-return-type -- because */
import type { Editor } from "@tldraw/tldraw";
import { useCallback, useEffect, useRef } from "react";
import { UPLOAD_BASE_URL, generateSerialKeys } from "../common";
import type { IMarkdownShape, IPdfShape } from "../shapes";

export type UploadCategory = "pdf" | "handout";
export const UploadCategoryMime: Record<UploadCategory, string> = {
  pdf: "application/pdf",
  handout: "text/markdown",
};

export const useInsertFile = (
  editor: Editor | undefined,
  category: UploadCategory,
  roomId: string
) => {
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!editor) return;
    const input = window.document.createElement("input");
    input.type = "file";
    input.accept = UploadCategoryMime[category];
    input.multiple = true;
    inputRef.current = input;
    const onchange = (e: Event) => {
      const fileList = (e.target as HTMLInputElement).files;
      if (!fileList || fileList.length === 0) return;

      Array.from(fileList).forEach((f) => {
        const id = generateSerialKeys(6, "-");
        const objectName =
          category !== "handout"
            ? `${id}-${f.name}`.replaceAll(/[^a-zA-Z0-9.]/g, "-")
            : f.name;
        const url = `${UPLOAD_BASE_URL}/${category}/${roomId}/${objectName}`;

        fetch(url, {
          method: "POST",
          body: f,
        })
          .then(() => {
            switch (category) {
              case "pdf":
                editor.createShape<IPdfShape>({
                  type: "pdf",
                  x: 200,
                  y: 200,
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
                  x: 200,
                  y: 200,
                  props: {
                    url,
                    w: 500,
                    h: 300,
                  },
                });

                break;
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });
      input.value = "";
    };
    input.addEventListener("change", onchange);
    return () => {
      inputRef.current = undefined;
      input.removeEventListener("change", onchange);
    };
  }, [category, editor, roomId]);

  return useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);
};
