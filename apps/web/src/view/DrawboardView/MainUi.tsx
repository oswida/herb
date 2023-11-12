import {
  Button,
  Dialog,
  Icon,
  getUserPreferences,
  track,
  useDialogs,
  useEditor,
} from "@tldraw/tldraw";
import { useEffect, useState } from "react";
import {
  csheetVisible,
  currentRoom,
  diceRollerVisible,
  notesVisible,
  uiVisible,
} from "../../common/state";
import { useAtom, useAtomValue } from "jotai";
import {
  actionsInfoStyle,
  actionsPanelStyle,
  actionsRootStyle,
} from "./style.css";
import { FaDiceD20, FaUserAlt, FaStickyNote, FaCogs } from "react-icons/fa";
import { hintStyle } from "../../common";
import { Settings } from "../../component/Settings";
import * as React from "react";

export const MainUI = track(() => {
  const editor = useEditor();
  const [hu, setHu] = useAtom(uiVisible);
  const [dv, setDv] = useAtom(diceRollerVisible);
  const [csv, setCsv] = useAtom(csheetVisible);
  const [nv, setNv] = useAtom(notesVisible);
  const { addDialog } = useDialogs();
  const user = getUserPreferences();
  const room = useAtomValue(currentRoom);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Delete":
        case "Backspace": {
          editor.deleteShapes(editor.selectedShapeIds);
          break;
        }
        case "v": {
          editor.setCurrentTool("select");
          break;
        }
        case "e": {
          editor.setCurrentTool("eraser");
          break;
        }
        case "x":
        case "p":
        case "b":
        case "d": {
          editor.setCurrentTool("draw");
          break;
        }
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  return (
    <>
      <div className={actionsRootStyle}>
        <div className={actionsPanelStyle}>
          <Button
            type="tool"
            data-state={hu ? "selected" : undefined}
            onClick={() => setHu(!hu)}
            title="Draw tools"
          >
            <Icon icon="tool-pencil" />
          </Button>
          <Button
            type="tool"
            data-state={dv ? "selected" : undefined}
            onClick={() => setDv(!dv)}
            title="Dice roller"
          >
            <FaDiceD20 size={16} />
          </Button>
          {/* <Button
            title="Charsheets"
            data-state={csv ? "selected" : undefined}
            onClick={() => setCsv(!csv)}
          >
            <FaUserAlt />
          </Button>
          <Button
            title="Notes"
            data-state={nv ? "selected" : undefined}
            onClick={() => setNv(!nv)}
          >
            <FaStickyNote />
          </Button> */}

          <Button
            type="tool"
            title="Settings"
            onClick={() => {
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
            <div className={hintStyle}>{room}</div>
            <div
              className={hintStyle}
              style={{ color: user.color ? user.color : "var(--color-text)" }}
            >
              {user.name}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
