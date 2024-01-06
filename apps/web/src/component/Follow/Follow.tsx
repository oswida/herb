import {
  Button,
  Dialog,
  Input,
  TLInstancePresence,
  TLUiDialogProps,
  useEditor,
} from "@tldraw/tldraw";
import { flexColumnStyle, flexRowStyle } from "../../common";
import React, { useMemo, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { WebsocketProvider } from "y-websocket";

type Props = TLUiDialogProps & {
  roomProvider: WebsocketProvider;
};

export const Follow = ({ onClose, roomProvider }: Props) => {
  const editor = useEditor();

  const users = useMemo(() => {
    const states = roomProvider.awareness.getStates() as Map<
      number,
      { presence: TLInstancePresence }
    >;
    const retv: TLInstancePresence[] = [];
    states.forEach((it) => {
      if (it && it.presence && it.presence.userId !== editor.user.getId())
        retv.push(it.presence);
    });
    return retv;
  }, [roomProvider]);

  const follow = (id: string) => {
    editor.startFollowingUser(id);
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Follow user</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})} style={{ padding: "10px" }}>
          {users.map((usr) => (
            <Button
              type="normal"
              key={usr.id}
              onPointerDown={() => follow(usr.userId)}
            >
              {usr.userName}
            </Button>
          ))}
        </div>
      </Dialog.Body>
    </>
  );
};
