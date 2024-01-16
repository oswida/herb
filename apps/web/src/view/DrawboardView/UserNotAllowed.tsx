import React, { useEffect, useState } from "react";
import { userNotAllowedStyle } from "./style.css";
import { Button, Input, getUserPreferences } from "@tldraw/tldraw";
import { FaCopy } from "react-icons/fa";
import { flexRowStyle } from "../../common";
import useClipboard from "react-use-clipboard";

type Props = {
  isUserAllowed: boolean;
  room: string | undefined;
  blockUser: (id: string, blocked: boolean) => Promise<void>;
  isBlocked: (id: string) => boolean;
  login: (roomId: string, secret: string) => void;
};

export const UserNotAlowed = ({
  isUserAllowed,
  room,
  blockUser,
  isBlocked,
  login,
}: Props) => {
  const user = getUserPreferences();
  const [copyUser, setCopyUser] = useClipboard(user.id);
  const [secret, setSecret] = useState("");

  useEffect(() => {
    if (isUserAllowed || isBlocked(user.id)) return;
    blockUser(user.id, true)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  }, [isBlocked, blockUser, room, isUserAllowed]);

  const block = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const userCopy = () => {
    setCopyUser();
  };

  const doLogin = async () => {
    if (secret.trim() === "") return;
    await login(room ?? "", secret);
    // window.location.reload();
  };

  if (isUserAllowed) return null;
  return (
    <div
      className={userNotAllowedStyle}
      onPointerDown={block}
      onPointerOver={block}
      onPointerEnter={block}
      onMouseOver={block}
      onPointerMove={block}
      onContextMenu={block}
    >
      <div>User</div>
      <div className={flexRowStyle({})}>
        <h3>{user.id}</h3>
        <Button type="icon" title="Copy user ID" onPointerDown={userCopy}>
          <FaCopy />
        </Button>
      </div>
      <div>
        need acceptance for room <b>{room}</b>
      </div>
      {isBlocked(user.id) && (
        <div>Please wait until room owner permits access.</div>
      )}
      {!isBlocked(user.id) && (
        <div>Acceptance request has been sent to room owner</div>
      )}
      <h3>Or alternatively you can login if you know the secret</h3>
      <div className={flexRowStyle({})}>
        <Input
          className="tlui-embed-dialog__input"
          placeholder=""
          autofocus
          onValueChange={(value) => {
            setSecret(value);
          }}
        />
        <Button type="normal" onPointerDown={doLogin}>
          Authenticate
        </Button>
      </div>
    </div>
  );
};
