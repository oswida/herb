import { Button, Dialog, Input, TLUiDialogProps } from "@tldraw/tldraw";
import { flexColumnStyle, flexRowStyle } from "../../common";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

type Props = TLUiDialogProps & {
  allowUser: (id: string, allow: boolean) => void;
  allowedUsers: string[];
};

export const Users = ({ allowUser, allowedUsers, onClose }: Props) => {
  const [user, setUser] = useState("");

  const allow = () => {
    if (user.trim() === "") return;
    allowUser(user, true);
    onClose();
  };

  const block = (id: string) => {
    if (id.trim() === "") return;
    allowUser(id, false);
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Allowed users</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div>Users</div>
        <div className={flexColumnStyle({})} style={{ padding: "10px" }}>
          {allowedUsers.map((it) => (
            <div className={flexRowStyle({ justify: "space" })} key={it}>
              <div>{it}</div>
              <Button
                type="icon"
                title="Block user"
                onPointerDown={() => block(it)}
              >
                <FaMinus />
              </Button>
            </div>
          ))}
        </div>
        <div>Add new user</div>
        <div className={flexRowStyle({ justify: "space" })}>
          <Input
            className="tlui-embed-dialog__input"
            placeholder=""
            autofocus
            onValueChange={(value) => {
              setUser(value);
            }}
          />
          <Button type="icon" onPointerDown={allow}>
            <FaPlus size={16} />
          </Button>
        </div>
      </Dialog.Body>
    </>
  );
};
