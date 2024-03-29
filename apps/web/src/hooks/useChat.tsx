import { Editor, JsonArray, JsonObject } from "@tldraw/tldraw";
import { useCallback, useEffect, useMemo } from "react";
import { ChatMsg, compressData64, decompressData64 } from "../common";

export const MAX_ROLLS_LENGTH = 40;

export const useChat = (editor: Editor | undefined) => {
  useEffect(() => {
    if (!editor) return;
    const chat = editor.getDocumentSettings().meta["chat"];
    if (!chat || chat === "")
      editor.updateDocumentSettings({
        meta: {
          ...editor.getDocumentSettings().meta,
          chat: compressData64([]),
        },
      });
  }, [editor]);

  const chatList = useMemo(() => {
    if (!editor) return [] as ChatMsg[];
    let list = editor.getDocumentSettings().meta["chat"];
    if (!list || list === "") return [] as ChatMsg[];
    const result = decompressData64(list) as ChatMsg[];
    return result ? result : ([] as ChatMsg[]);
  }, [editor, editor?.getDocumentSettings().meta]);

  const chatListSize = useMemo(() => {
    if (!editor) return "0/0";
    let list = editor.getDocumentSettings().meta["chat"] as string;
    const sz = list ? list.length : 0;
    if (!list || list === "") return "0/0";
    const result = decompressData64(list) as ChatMsg[];
    return result
      ? `${result.length}: ${sz}/${JSON.stringify(result).length}`
      : "0/0";
  }, [editor, editor?.getDocumentSettings().meta]);

  const addChatMessage = useCallback(
    (msg: ChatMsg) => {
      if (!editor) return;
      let list = editor.getDocumentSettings().meta["chat"] as JsonArray;
      if (!list) list = [];
      else list = decompressData64(list);
      if (!list) list = []; // bad compression ?
      while (list.length >= MAX_ROLLS_LENGTH) list.shift();
      list.push(msg as any);
      const newMeta = {
        ...editor.getDocumentSettings().meta,
        chat: compressData64(list),
      };
      editor.updateDocumentSettings({ meta: newMeta });
    },
    [editor]
  );

  const updateChatMessage = useCallback(
    (msg: ChatMsg) => {
      if (!editor) return;
      let list = editor.getDocumentSettings().meta["chat"] as JsonArray;
      if (!list) list = [];
      else list = decompressData64(list);
      if (!list) list = []; // bad compression ?
      for (let i = 0; i < list.length; i++) {
        const l = list[i] as unknown as ChatMsg;
        if (l && l.id === msg.id) {
          list[i] = { ...msg } as any;
          break;
        }
      }
      const newMeta = {
        ...editor.getDocumentSettings().meta,
        chat: compressData64(list),
      };
      editor.updateDocumentSettings({ meta: newMeta });
    },
    [editor]
  );

  const clearChat = useCallback(() => {
    if (!editor) return;
    const newMeta = {
      ...editor.getDocumentSettings().meta,
      chat: compressData64([]),
    };
    editor.updateDocumentSettings({ meta: newMeta });
  }, [editor]);

  return {
    chatList,
    addChatMessage,
    clearChat,
    chatListSize,
    updateChatMessage,
  };
};
