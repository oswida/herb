import {
  TLUiDialogProps,
  TldrawUiButton,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  TldrawUiInput,
  useDefaultHelpers,
} from "@tldraw/tldraw";
import { flexColumnStyle, flexRowStyle } from "../../common";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

type Props = TLUiDialogProps & {
  allowUser: (id: string, allow: boolean) => void;
  allowedUsers: string[];
  blockedList: string[];
  blockUser: (id: string, blocked: boolean) => Promise<void>;
  changeSecret: (secret: string) => void;
};

export const Users = ({
  allowUser,
  allowedUsers,
  onClose,
  blockUser,
  blockedList,
  changeSecret,
}: Props) => {
  const [user, setUser] = useState("");
  const [secret, setSecret] = useState("");
  const { addToast } = useDefaultHelpers();

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

  const change = async () => {
    await changeSecret(secret);
    onClose();
    addToast({
      title: "Change room secret",
      description: "Secret has been changed",
    });
  };

  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Allowed users</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody>
        <div>Waiting for acceptance</div>
        <div
          className={flexColumnStyle({})}
          style={{ padding: "10px", maxHeight: 120, overflow: "auto" }}
        >
          {blockedList.map((it) => (
            <div className={flexRowStyle({ justify: "space" })} key={it}>
              <div>{it}</div>
              <TldrawUiButton
                type="icon"
                title="Accept user"
                onPointerDown={() => accept(it)}
              >
                <FaPlus />
              </TldrawUiButton>
            </div>
          ))}
        </div>
        <div>Accepted users</div>
        <div
          className={flexColumnStyle({})}
          style={{ padding: "10px", maxHeight: 120, overflow: "auto" }}
        >
          {allowedUsers.map((it) => (
            <div className={flexRowStyle({ justify: "space" })} key={it}>
              <div>{it}</div>
              <TldrawUiButton
                type="icon"
                title="Kick user"
                onPointerDown={() => kick(it)}
              >
                <FaMinus />
              </TldrawUiButton>
            </div>
          ))}
        </div>
        <div>Change room secret</div>
        <div className={flexRowStyle({})}>
          <TldrawUiInput
            className="tlui-embed-dialog__input"
            placeholder=""
            autofocus
            onValueChange={(value) => {
              setSecret(value);
            }}
          />
          <TldrawUiButton type="normal" onPointerDown={change}>
            Change
          </TldrawUiButton>
        </div>
      </TldrawUiDialogBody>
    </>
  );
};
