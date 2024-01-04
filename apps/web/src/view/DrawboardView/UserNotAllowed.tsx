import React from "react";
import { userNotAllowedStyle } from "./style.css";
import {
  Button,
  getUserPreferences,
  preventDefault,
  useEditor,
} from "@tldraw/tldraw";
import { FaCopy } from "react-icons/fa";
import { flexRowStyle } from "../../common";
import useClipboard from "react-use-clipboard";

type Props = {
  isUserAllowed: boolean;
  room: string | undefined;
};

export const UserNotAlowed = ({ isUserAllowed, room }: Props) => {
  const user = getUserPreferences();
  const [copyUser, setCopyUser] = useClipboard(user.id);

  const block = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const userCopy = () => {
    setCopyUser();
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
      <div>Please send info to the room owner.</div>
    </div>
  );
};
