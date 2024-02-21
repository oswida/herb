import {
  TLInstancePresence,
  TLUiDialogProps,
  TldrawUiButton,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  useEditor,
} from "@tldraw/tldraw";
import { flexColumnStyle } from "../../common";
import React, { useMemo } from "react";
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
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Follow user</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody>
        <div className={flexColumnStyle({})} style={{ padding: "10px" }}>
          {users.map((usr) => (
            <TldrawUiButton
              type="normal"
              key={usr.id}
              onPointerDown={() => follow(usr.userId)}
            >
              {usr.userName}
            </TldrawUiButton>
          ))}
        </div>
      </TldrawUiDialogBody>
    </>
  );
};
