import {
  Editor,
  HistoryEntry,
  TLRecord,
  createShapeId,
  useEditor,
} from "@tldraw/tldraw";
import { useCallback, useEffect, useMemo } from "react";
import { GLOBAL_INFO_SHAPE } from "../common";
import { useNavigate } from "react-router-dom";

export const useGlobalInfo = (editor: Editor | undefined) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!editor) return;
    const info = getGlobalInfo();
    if (!info) return;
    if (!info.owner) {
      updateGlobalInfo({
        owner: editor.user.getId(),
        ownerName: editor.user.getName(),
        banned: [],
        roomName: "",
      });
    }
  }, [editor]);

  const getGlobalInfo = useCallback(() => {
    if (!editor) return undefined;
    const id = createShapeId(GLOBAL_INFO_SHAPE);
    let shape = editor.getShape(id);
    if (!shape) {
      editor.createShape({ id: id, type: "hidden", meta: {} });
      shape = editor.getShape(id);
    }
    if (!shape) return undefined;
    return shape.meta;
  }, [editor]);

  const updateGlobalInfo = useCallback(
    (data: any) => {
      if (!editor) return;
      const id = createShapeId(GLOBAL_INFO_SHAPE);
      const shape = editor.getShape(id);
      if (!shape) return;
      editor.updateShapes([
        {
          id: id,
          type: shape.type,
          meta: {
            ...data,
          },
        },
      ]);
    },
    [editor]
  );

  const isOwner = useMemo(() => {
    if (!editor) return false;
    const info = getGlobalInfo();
    if (!info || !info.owner) return false;
    return info.owner === editor?.user.getId();
  }, [editor]);

  const owner = useMemo(() => {
    if (!editor) return undefined;
    const info = getGlobalInfo();
    if (!info) return undefined;
    return info.owner;
  }, [editor]);

  const ownerName = useMemo(() => {
    if (!editor) return undefined;
    const info = getGlobalInfo();
    if (!info) return undefined;
    return info.ownerName;
  }, [editor]);

  const isBlocked = useCallback(
    (id: string) => {
      if (!editor) return false;
      const info = getGlobalInfo();
      if (!info || !info.banned) return false;
      const banlist = info.banned as string[];
      if (!banlist) return false;
      return banlist.includes(id);
    },
    [editor]
  );

  const consumeChanges = useCallback(
    (changes: HistoryEntry<TLRecord>) => {
      if (!editor) return;
      console.log("changes");
      const id = createShapeId(GLOBAL_INFO_SHAPE);
      const update = changes.changes.updated[id];
      if (!update) return;
      const entry = update[update.length - 1];
      let banlist = entry.meta.banned as string[];
      if (!banlist || banlist.length === 0) return;
      if (banlist.includes(editor.user.getId())) {
        window.location.reload(); // raw
      }
    },
    [editor]
  );

  return {
    getGlobalInfo,
    updateGlobalInfo,
    isOwner,
    isBlocked,
    owner,
    ownerName,
    consumeChanges,
  };
};
