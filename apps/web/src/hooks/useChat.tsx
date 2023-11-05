import { Editor, JsonArray } from "@tldraw/tldraw";
import { useCallback, useEffect, useMemo } from "react";
import { ChatMsg, compressData64, decompressData64 } from "../common";

export const useChat = (editor: Editor | undefined) => {
  useEffect(() => {
    if (!editor) return;
    const chat = editor.documentSettings.meta["chat"];
    if (!chat || chat === "")
      editor.updateDocumentSettings({
        meta: { ...editor.documentSettings.meta, chat: compressData64([]) },
      });
  }, [editor]);

  const chatList = useMemo(() => {
    if (!editor) return [] as ChatMsg[];
    let list = editor.documentSettings.meta["chat"];
    if (!list || list === "") return [] as ChatMsg[];
    const result = decompressData64(list) as ChatMsg[];
    return result ? result : ([] as ChatMsg[]);
  }, [editor, editor?.documentSettings.meta]);

  const chatListSize = useMemo(() => {
    if (!editor) return "0/0";
    let list = editor.documentSettings.meta["chat"] as string;
    const sz = list ? list.length : 0;
    if (!list || list === "") return "0/0";
    const result = decompressData64(list) as ChatMsg[];
    return result
      ? `${result.length}: ${sz}/${JSON.stringify(result).length}`
      : "0/0";
  }, [editor, editor?.documentSettings.meta]);

  const addChatMessage = useCallback(
    (msg: ChatMsg) => {
      if (!editor) return;
      let list = editor.documentSettings.meta["chat"] as JsonArray;
      if (!list) list = [];
      else list = decompressData64(list);
      if (!list) list = []; // bad compression ?
      list.push(msg as any);
      const newMeta = {
        ...editor.documentSettings.meta,
        chat: compressData64(list),
      };
      editor.updateDocumentSettings({ meta: newMeta });
    },
    [editor]
  );

  const clearChat = useCallback(() => {
    if (!editor) return;
    const newMeta = {
      ...editor.documentSettings.meta,
      chat: compressData64([]),
    };
    editor.updateDocumentSettings({ meta: newMeta });
  }, [editor]);

  return { chatList, addChatMessage, clearChat, chatListSize };
};
