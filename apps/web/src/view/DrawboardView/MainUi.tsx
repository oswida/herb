import {
  Button,
  Icon,
  getUserPreferences,
  useDialogs,
  useEditor,
  useToasts,
} from "@tldraw/tldraw";
import {
  assetListVisible,
  currentRoom,
  diceRollerVisible,
  roomPresence,
  uiVisible,
} from "../../common/state";
import { useAtom, useAtomValue } from "jotai";
import {
  actionsInfoStyle,
  actionsPanelStyle,
  actionsRootStyle,
} from "./style.css";
import { FaDiceD20, FaCogs, FaChalkboard } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { Settings } from "../../component/Settings";
import * as React from "react";
import useClipboard from "react-use-clipboard";
import { flexRowStyle } from "../../common";
import { useMemo } from "react";

interface Props {
  ownerName: string;
  isOwner: boolean;
  blockUser: (id: string, block: boolean) => void;
  blockedList: string[];
  isBlocked: (id: string) => boolean;
  ownerId: string;
}

export const MainUI = ({
  ownerName,
  isOwner,
  ownerId,
  blockUser,
  blockedList,
  isBlocked,
}: Props) => {
  const editor = useEditor();
  const [uv, setUv] = useAtom(uiVisible);
  const [dv, setDv] = useAtom(diceRollerVisible);
  const [al, setAl] = useAtom(assetListVisible);
  const presence = useAtomValue(roomPresence);

  const { addDialog } = useDialogs();
  const { addToast } = useToasts();
  const user = getUserPreferences();
  const room = useAtomValue(currentRoom);
  const [copyUser, setCopyUser] = useClipboard(user.id);
  const [copyRoom, setCopyRoom] = useClipboard(room ? room : "");

  const userCopy = () => {
    setCopyUser();
    addToast({
      id: "1",
      title: "Copy user id",
      description: `User id: ${user.id} copied to clipboard`,
    });
  };

  const roomCopy = () => {
    setCopyRoom();
    addToast({
      id: "1",
      title: "Copy room id",
      description: `Room id: ${room} copied to clipboard`,
    });
  };

  const roomInfo = useMemo(() => {
    const lines: string[] = [];
    lines.push(`ID: ${room}`);
    if (ownerName) {
      lines.push(`Owner: ${ownerName}`);
    }
    return lines.join("\n");
  }, [room, presence]);

  // const usersInfo = useMemo(() => {
  //   const lines: string[] = [];
  //   lines.push(`Connected users`);
  //   Object.values(presence).forEach((it) => {
  //     lines.push(it.name);
  //   });
  //   return lines.join("\n");
  // }, [room, presence]);

  return (
    <div className={actionsRootStyle}>
      <div className={actionsPanelStyle}>
        <div className={actionsInfoStyle}>
          <Button type="normal" title={user.id} onPointerDown={userCopy}>
            <span
              style={{ color: user.color ? user.color : "var(--color-text)" }}
            >
              {user.name}
            </span>
          </Button>
        </div>
        <Button
          type="tool"
          data-state={uv ? "selected" : undefined}
          onPointerDown={() => setUv(!uv)}
          title="Draw tools"
        >
          <Icon icon="tool-pencil" />
        </Button>
        <Button
          type="tool"
          data-state={dv ? "selected" : undefined}
          onPointerDown={() => setDv(!dv)}
          title="Dice roller"
        >
          <FaDiceD20 size={16} />
        </Button>
        {isOwner && (
          <Button
            type="tool"
            data-state={al ? "selected" : undefined}
            onPointerDown={() => setAl(!al)}
            title="Asset list"
          >
            <MdLibraryBooks size={20} />
          </Button>
        )}

        <Button
          type="tool"
          title="Settings"
          onPointerDown={() => {
            addDialog({
              component: ({ onClose }) => <Settings onClose={onClose} />,
              onClose: () => {
                editor.setCurrentTool("select");
              },
            });
          }}
        >
          <FaCogs size={16} />
        </Button>

        <div className={actionsInfoStyle}>
          <Button type="normal" title={roomInfo} onPointerDown={roomCopy}>
            <div className={flexRowStyle({})}>
              <FaChalkboard size={20} />
            </div>
          </Button>
          {/* {isOwner && (
            <Button
              type="normal"
              title={usersInfo}
              onClick={() =>
                addDialog({
                  component: ({ onClose }) => (
                    <Users
                      onClose={onClose}
                      blockUser={blockUser}
                      blockedList={blockedList}
                      isBlocked={isBlocked}
                      isOwner={isOwner}
                      ownerId={ownerId}
                    />
                  ),
                  onClose: () => {
                    void null;
                  },
                })
              }
            >
              <div className={flexRowStyle({})}>
                <FaUsers size={20} />
                {Object.keys(presence).length}
              </div>
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
};
