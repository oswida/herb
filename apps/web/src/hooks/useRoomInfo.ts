import { useAtom, useAtomValue } from "jotai";
import { currentRoom, roomData, roomPresence } from "../common";
import { Editor } from "@tldraw/tldraw";
import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTlDrawData } from "./useTldrawData";

export const useRoomInfo = (roomApiUrl: string) => {
  const roomId = useAtomValue(currentRoom);
  const { tldrawUserId } = useTlDrawData();
  const { data, refetch } = useQuery({
    queryKey: ["roomInfo", tldrawUserId, roomId],
    queryFn: () =>
      fetch(`${roomApiUrl}/${roomId}/${tldrawUserId}`, {
        method: "GET",
      }).then((res) => res.json()),
    networkMode: "online",
    // refetchOnMount: true,
    // refetchOnReconnect: true,
    // refetchOnWindowFocus: true,
    staleTime: 0,
  });
  const [rdata, setRdata] = useAtom(roomData);
  const presence = useAtomValue(roomPresence);

  useEffect(() => {
    if (!roomId) return;
    refetch().then((res) => {
      // console.log("refetch", res);
    });
  }, [roomId, roomApiUrl]);

  useEffect(() => {
    setRdata(data);
  }, [data, roomId]);

  const isOwner = useMemo(() => {
    if (!rdata) return false;
    return tldrawUserId === rdata.owner;
  }, [rdata, roomId]);

  const ownerName = useMemo(() => {
    if (!rdata || !presence[rdata.owner]) return "";
    return presence[rdata.owner].name;
  }, [rdata, presence, roomId]);

  const ownerId = useMemo(() => {
    if (!rdata) return "";
    return rdata.owner;
  }, [rdata]);

  const isBlocked = useCallback(
    (id: string) => {
      if (!rdata) return false;
      return rdata.blockedUsers.includes(id);
    },
    [rdata]
  );

  const iamBlocked = useMemo(() => {
    if (!rdata) return false;
    return rdata.blockedUsers.includes(tldrawUserId);
  }, [rdata, tldrawUserId]);

  const blockedList = useMemo(() => {
    if (!rdata) return [];
    return rdata.blockedUsers;
  }, [rdata]);

  const blockUser = useCallback(
    async (id: string, blocked: boolean) => {
      if (!rdata || rdata.owner === id) return;
      const newData = blocked
        ? [...rdata.blockedUsers, id]
        : rdata.blockedUsers.filter((u) => u !== id);
      await fetch(`${roomApiUrl}/${rdata.id}/${tldrawUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockedUsers: newData }),
      });
      await refetch();
    },
    [rdata, roomApiUrl, tldrawUserId]
  );

  const allowUser = useCallback(
    async (id: string, allow: boolean) => {
      if (!rdata || rdata.owner === id) return;
      const newData = allow
        ? [...rdata.allowedUsers, id]
        : rdata.allowedUsers.filter((u) => u !== id);
      await fetch(`${roomApiUrl}/${rdata.id}/${tldrawUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ allowedUsers: newData }),
      });
      await refetch();
    },
    [rdata, roomApiUrl, tldrawUserId]
  );

  const allowedUsers = useMemo(() => {
    if (!rdata) return [];
    return rdata.allowedUsers;
  }, [rdata]);

  const isUserAllowed = useMemo(() => {
    if (isOwner) return true;
    return allowedUsers.includes(tldrawUserId);
  }, [rdata, isOwner, tldrawUserId, allowedUsers]);

  return {
    isOwner,
    ownerName,
    isBlocked,
    blockUser,
    blockedList,
    ownerId,
    iamBlocked,
    allowedUsers,
    isUserAllowed,
    allowUser,
  };
};
