import {
  Button,
  Dialog,
  Input,
  TLUiDialogProps,
  getUserPreferences,
  setUserPreferences,
  useEditor,
} from "@tldraw/tldraw";
import {
  Presence,
  currentRoom,
  flexColumnStyle,
  flexRowStyle,
  roomPresence,
} from "../../common";
import React, { useMemo, useState } from "react";
import Compact from "@uiw/react-color-compact";
import { useAtomValue } from "jotai";
import {
  FaUserCheck,
  FaUserLock,
  FaUserMinus,
  FaUserSlash,
} from "react-icons/fa";
import { useGlobalInfo } from "../../hooks";

export const Users = (props: TLUiDialogProps) => {
  const presence = useAtomValue(roomPresence);
  const editor = useEditor();
  const { getGlobalInfo, updateGlobalInfo, isOwner, isBlocked, owner } =
    useGlobalInfo(editor);
  const [bannedUsers, setBannedUsers] = useState<string[] | undefined>(
    getGlobalInfo()?.banned as string[]
  );

  const list = useMemo(() => {
    const lines: Presence[] = [];
    Object.values(presence).forEach((it) => {
      lines.push(it);
    });
    return lines;
  }, [presence]);

  const ban = (id: string) => {
    if (!isOwner) return;
    let banlist = bannedUsers ? [...bannedUsers] : ([] as string[]);
    banlist.push(id);
    updateGlobalInfo({
      banned: banlist,
    });
    setBannedUsers(banlist);
  };

  const unban = (id: string) => {
    if (!isOwner) return;
    let banlist = bannedUsers;
    if (!banlist) return;
    if (banlist.includes(id)) {
      banlist = banlist.filter((it) => it !== id);
      updateGlobalInfo({
        banned: banlist,
      });
      setBannedUsers(banlist);
    }
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Connected users</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})} style={{ padding: "10px" }}>
          {list.map((it) => (
            <div className={flexRowStyle({ justify: "space" })} key={it.id}>
              <div>
                {it.name} {bannedUsers?.includes(it.id) ? "(blocked)" : ""}
              </div>
              {owner !== it.id && isOwner && (
                <>
                  {!isBlocked(it.id) && (
                    <Button
                      type="icon"
                      title="Block user"
                      onClick={() => ban(it.id)}
                    >
                      <FaUserSlash size={16} fill="var(--color-accent)" />
                    </Button>
                  )}
                  {isBlocked(it.id) && (
                    <Button
                      type="icon"
                      title="Unblock user"
                      onClick={() => unban(it.id)}
                    >
                      <FaUserCheck size={16} fill="var(--color-primary)" />
                    </Button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </Dialog.Body>
    </>
  );
};
