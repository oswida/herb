import { Editor, uniqueId } from "@tldraw/tldraw";
import { useCallback, useEffect, useRef } from "react";

// Insert shapes from JSON file
export const useInsertJson = (editor: Editor | undefined) => {
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!editor) return;
    const input = window.document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.multiple = true;
    inputRef.current = input;
    async function onchange(e: Event) {
      const fileList = (e.target as HTMLInputElement).files;
      if (!fileList || fileList.length === 0) return;

      Array.from(fileList).forEach(async (f) => {
        if (!editor) return;
        const data = await f.text();
        const json = JSON.parse(data);
        if (!json) return;
        const pageId = editor.getCurrentPageId();
        json.shapes.forEach((s: any) => {
          s.id = `shape:${uniqueId()}`;
          s.parentId = pageId;
        });
        editor.createShapes(json.shapes);
        // do not map assets because we have to have them uploaded anyway
        editor.createAssets(json.assets);
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
