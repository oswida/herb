import { Button, Dialog, TLUiDialogProps } from "@tldraw/tldraw";
import {
  Presence,
  flexColumnStyle,
  flexRowStyle,
  roomPresence,
} from "../../common";
import React, { useMemo } from "react";
import { useAtomValue } from "jotai";
import { FaUserCheck, FaUserSlash } from "react-icons/fa";

type Props = TLUiDialogProps & {
  isOwner: boolean;
  blockUser: (id: string, block: boolean) => void;
  blockedList: string[];
  isBlocked: (id: string) => boolean;
  ownerId: string;
};

export const Users = ({ isOwner, isBlocked, blockUser, ownerId }: Props) => {
  const presence = useAtomValue(roomPresence);

  const list = useMemo(() => {
    const lines: Presence[] = [];
    Object.values(presence).forEach((it) => {
      lines.push(it);
    });
    return lines;
  }, [presence]);

  const ban = (id: string) => {
    if (!isOwner) return;
    blockUser(id, true);
  };

  const unban = (id: string) => {
    if (!isOwner) return;
    blockUser(id, false);
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
                {it.name} {isBlocked(it.id) ? "(blocked)" : ""}
              </div>
              {ownerId !== it.id && isOwner && (
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
