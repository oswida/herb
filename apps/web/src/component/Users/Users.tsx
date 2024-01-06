import { Button, Dialog, Input, TLUiDialogProps } from "@tldraw/tldraw";
import { flexColumnStyle, flexRowStyle } from "../../common";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

type Props = TLUiDialogProps & {
  allowUser: (id: string, allow: boolean) => void;
  allowedUsers: string[];
  blockedList: string[];
  blockUser: (id: string, blocked: boolean) => Promise<void>;
};

export const Users = ({
  allowUser,
  allowedUsers,
  onClose,
  blockUser,
  blockedList,
}: Props) => {
  const [user, setUser] = useState("");

  const allow = () => {
    if (user.trim() === "") return;
    allowUser(user, true);
    onClose();
  };

  const kick = (id: string) => {
    if (id.trim() === "") return;
    allowUser(id, false);
    onClose();
  };

  const accept = (id: string) => {
    if (id.trim() === "") return;
    allowUser(id, true);
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Allowed users</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div>Waiting for acceptance</div>
        <div className={flexColumnStyle({})} style={{ padding: "10px" }}>
          {blockedList.map((it) => (
            <div className={flexRowStyle({ justify: "space" })} key={it}>
              <div>{it}</div>
              <Button
                type="icon"
                title="Accept user"
                onPointerDown={() => accept(it)}
              >
                <FaPlus />
              </Button>
            </div>
          ))}
        </div>
        <div>Accepted users</div>
        <div className={flexColumnStyle({})} style={{ padding: "10px" }}>
          {allowedUsers.map((it) => (
            <div className={flexRowStyle({ justify: "space" })} key={it}>
              <div>{it}</div>
              <Button
                type="icon"
                title="Kick user"
                onPointerDown={() => kick(it)}
              >
                <FaMinus />
              </Button>
            </div>
          ))}
        </div>
      </Dialog.Body>
    </>
  );
};
