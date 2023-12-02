import { Editor, TLShapeId, exportAs } from "@tldraw/tldraw";
import { useCallback } from "react";

export const useBackup = (editor: Editor | undefined) => {
  const backupPage = useCallback(() => {
    if (!editor) return;
    const shapes = editor.getCurrentPageShapes();
    if (shapes.length === 0) {
      return;
    }
    const idents: TLShapeId[] = [];
    shapes.forEach((s) => idents.push(s.id));
    exportAs(editor, idents, "json")
      .then(() => {})
      .catch((e) => {
        console.error(e);
      });
  }, [editor]);

  return { backupPage };
};
