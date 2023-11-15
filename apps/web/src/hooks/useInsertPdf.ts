import { Editor, uniqueId, useEditor } from "@tldraw/tldraw";
import { useCallback, useEffect, useRef } from "react";
import { UPLOAD_URL } from "../common";
import { IPdfShape } from "../shapes";

export const useInsertPdf = (editor: Editor | undefined) => {
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!editor) return;
    const input = window.document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.multiple = true;
    inputRef.current = input;
    async function onchange(e: Event) {
      const fileList = (e.target as HTMLInputElement).files;
      if (!fileList || fileList.length === 0) return;

      Array.from(fileList).forEach(async (f) => {
        if (!editor) return;
        const id = uniqueId();
        const objectName = `${id}-${f.name}`.replaceAll(/[^a-zA-Z0-9.]/g, "-");
        const url = `${UPLOAD_URL}/${objectName}`;
        await fetch(url, {
          method: "POST",
          body: f,
        });

        editor.createShape<IPdfShape>({
          type: "pdf",
          x: editor.getViewportPageCenter().x,
          y: editor.getViewportPageCenter().y,
          props: {
            pdf: url,
            w: 500,
            h: 300,
          },
        });
      });
      input.value = "";
    }
    input.addEventListener("change", onchange);
    return () => {
      inputRef.current = undefined;
      input.removeEventListener("change", onchange);
    };
  }, [editor]);

  return useCallback(() => {
    inputRef.current?.click();
  }, [inputRef, editor]);
};
