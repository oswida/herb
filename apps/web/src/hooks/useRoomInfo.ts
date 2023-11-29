import { useAtom, useAtomValue } from "jotai";
import { currentRoom, roomData, roomPresence } from "../common";
import { Editor } from "@tldraw/tldraw";
import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export const useRoomInfo = (editor: Editor | undefined, roomApiUrl: string) => {
  const roomId = useAtomValue(currentRoom);
  const { data, refetch } = useQuery({
    queryKey: ["roomInfo", editor?.user.getId(), roomId],
    queryFn: () =>
      fetch(`${roomApiUrl}/${roomId}/${editor?.user.getId()}`, {
        method: "GET",
      }).then((res) => res.json()),
    networkMode: "online",
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
  const [rdata, setRdata] = useAtom(roomData);
  const presence = useAtomValue(roomPresence);

  useEffect(() => {
    if (!roomId || !editor) return;
    refetch().then(() => {});
  }, [roomId, editor, roomApiUrl]);

  useEffect(() => {
    setRdata(data);
  }, [data, roomId]);

  const isOwner = useMemo(() => {
    if (!editor || !rdata) return false;
    return editor.user.getId() === rdata.owner;
  }, [editor, rdata, roomId]);

  const ownerName = useMemo(() => {
    if (!rdata || !presence[rdata.owner]) return "";
    return presence[rdata.owner].name;
  }, [editor, rdata, presence, roomId]);

  const ownerId = useMemo(() => {
    if (!rdata) return "";
    return rdata.owner;
  }, [editor, rdata]);

  const isBlocked = useCallback(
    (id: string) => {
      if (!rdata) return false;
      return rdata.blockedUsers.includes(id);
    },
    [editor, rdata]
  );

  const iamBlocked = useMemo(() => {
    if (!rdata || !editor) return false;
    return rdata.blockedUsers.includes(editor.user.getId());
  }, [editor, rdata]);

  const blockedList = useMemo(() => {
    if (!rdata) return [];
    return rdata.blockedUsers;
  }, [editor, rdata]);

  const blockUser = useCallback(
    async (id: string, blocked: boolean) => {
      if (!rdata || rdata.owner === id) return;
      const newData = blocked
        ? [...rdata.blockedUsers, id]
        : rdata.blockedUsers.filter((u) => u !== id);
      await fetch(`${roomApiUrl}/${rdata.id}/${editor?.user.getId()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockedUsers: newData }),
      });
      const result = await refetch();
      console.log("refetch result ", result);
    },
    [editor, rdata, roomApiUrl, editor?.user]
  );

  return {
    isOwner,
    ownerName,
    isBlocked,
    blockUser,
    blockedList,
    ownerId,
    iamBlocked,
  };
};
