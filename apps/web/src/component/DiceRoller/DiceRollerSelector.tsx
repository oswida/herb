import { useEffect, useMemo, useState } from "react";
import {
  diceRollerSelectorStyle,
  diceRollerSelectorValueStyle,
} from "./style.css";
import { flexColumnStyle, flexRowStyle } from "../../common";
import {
  FaCommentDots,
  FaDice,
  FaDiceD20,
  FaDiceD6,
  FaDiceFour,
  FaDiceThree,
  FaReply,
  FaSwift,
  FaTrashAlt,
  FaUserSecret,
} from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { VscRequestChanges } from "react-icons/vsc";
import { RxReset } from "react-icons/rx";
import {
  Button,
  getDefaultColorTheme,
  getUserPreferences,
  useDialogs,
  useEditor,
  useToasts,
} from "@tldraw/tldraw";
import { useChat, useRoll } from "../../hooks";
import React from "react";
import { DiceDialog } from "./DiceDialog";
import { Confirmation } from "../Confirmation";

export const DiceRollerSelector = () => {
  const MAX_DICE_POOL = 99;
  const [selectedDice, setSelectedDice] = useState<Record<string, number>>({});
  const faces = {
    "4": "d4",
    "6": "d6",
    "8": "d8",
    "10": "d10",
    "12": "d12",
    "20": "d20",
    "100": "d100",
  };
  const faces2 = {
    F: "Fate",
    Td: "Trophy dark",
    Tl: "Trophy light",
    "2": "d2",
  };
  const [currentFace, setCurrentFace] = useState<Record<string, string>>(faces);
  const [mPrivate, setMPrivate] = useState(false);
  const [mMod, setMMod] = useState(false);
  const [mComment, setMComment] = useState(false);
  const editor = useEditor();
  const { addChatMessage, clearChat } = useChat(editor);
  const user = getUserPreferences();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.isDarkMode,
  });
  const { rollSingleToChat } = useRoll(user, theme);
  const { addDialog, dialogs } = useDialogs();
  const { addToast } = useToasts();

  useEffect(() => {
    reset();
  }, []);

  const inc = (e: any, face: string) => {
    let value = selectedDice[face];
    if (!value) {
      value = 0;
    }
    if (e.shiftKey) {
      value -= 1;
    } else {
      value += 1;
    }
    if (value < 0) value = 0;
    if (value > MAX_DICE_POOL) {
      value = MAX_DICE_POOL;
    }
    setSelectedDice((prev) => ({ ...prev, [face]: value }));
  };

  const roll = () => {
    if (notation.trim() === "") {
      addToast({ title: "Error", description: "You need to select some dice" });
      return;
    }
    if (mMod || mComment) {
      addDialog({
        component: ({ onClose }) => (
          <DiceDialog
            onClose={onClose}
            notation={notation}
            private={mPrivate}
            hasComment={mComment}
            hasMod={mMod}
            isCustom={false}
          />
        ),
        onClose: () => {
          editor.setCurrentTool("select");
        },
      });
      return;
    }
    const msg = rollSingleToChat(notation, mPrivate);
    addChatMessage(msg);
  };

  const rollCustom = () => {
    addDialog({
      component: ({ onClose }) => (
        <DiceDialog
          onClose={onClose}
          notation={notation}
          private={mPrivate}
          hasComment={mComment}
          hasMod={mMod}
          isCustom={true}
        />
      ),
      onClose: () => {
        editor.setCurrentTool("select");
      },
    });
  };

  const reset = () => {
    const rr: Record<string, number> = {};
    Object.keys(currentFace).forEach((it) => (rr[it] = 0));
    setSelectedDice(rr);
  };

  const notation = useMemo(() => {
    const d: string[] = [];
    Object.keys(selectedDice).forEach((key) => {
      if (selectedDice[key] > 0) {
        d.push(`${selectedDice[key]}d${key}`);
      }
    });
    return d.join("+");
  }, [selectedDice]);

  const clear = () => {
    addDialog({
      component: ({ onClose }) => (
        <Confirmation
          onClose={onClose}
          title="Clear chat"
          message="Clear dice chat?"
          callback={clearChat}
        />
      ),
      onClose: () => {
        editor.setCurrentTool("select");
      },
    });
  };

  const switchDice = () => {
    reset();
    if (Object.keys(currentFace).includes(Object.keys(faces)[0]))
      setCurrentFace(faces2);
    else setCurrentFace(faces);
  };

  const compareDice = (a: string, b: string) => {
    const n1 = Number.parseInt(a);
    const n2 = Number.parseInt(b);
    if (n1 !== Number.NaN && n2 !== Number.NaN)
      return n1 > n2 ? 1 : n2 > n1 ? -1 : 0;
    if (n1 !== Number.NaN) return 1;
    return 0;
  };

  return (
    <div className={flexColumnStyle()} style={{ gap: "2px" }}>
      {/* Dice */}
      <div className={flexRowStyle({ justify: "center" })}>
        {currentFace &&
          Object.keys(currentFace)
            .sort(compareDice)
            .map((it) => (
              <div
                key={it}
                className={diceRollerSelectorStyle}
                title={`${currentFace[it]}\nClick to increase.\nShift+click to decrease.`}
                onClick={(e) => inc(e, it)}
              >
                <span>{it}</span>
                {selectedDice[it] > 0 && (
                  <div className={diceRollerSelectorValueStyle}>
                    {selectedDice[it]}
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* Roll buttons */}
      <div
        className={flexRowStyle({ justify: "space" })}
        style={{
          gap: "0px",
          padding: "0px 10px",
        }}
      >
        <Button
          title="Roll"
          type="normal"
          onClick={roll}
          disabled={notation.trim() === ""}
        >
          <FaDiceD20 size={20} fill={"var(--color-accent)"} />
          <div
            style={{
              fontSize: 14,
              overflowWrap: "break-word",
              wordWrap: "break-word",
              color: "var(--color-text)",
              marginLeft: "10px",
              maxWidth: "200px",
            }}
          >
            {notation}
          </div>
        </Button>

        <Button title="Custom roll" onClick={rollCustom} type="normal">
          <FaDiceD6 size={20} />
        </Button>
      </div>

      {/* Actions */}
      <div
        className={flexRowStyle({ justify: "space" })}
        style={{
          gap: 0,
        }}
      >
        <div className={flexRowStyle({})} style={{ gap: "0px" }}>
          <Button
            type="tool"
            title="Private roll"
            data-state={mPrivate ? "selected" : undefined}
            onClick={() => setMPrivate(!mPrivate)}
          >
            <FaUserSecret size={16} />
          </Button>
          <Button
            type="tool"
            title="With modifier"
            data-state={mMod ? "selected" : undefined}
            onClick={() => setMMod(!mMod)}
          >
            <VscRequestChanges size={16} />
          </Button>
          <Button
            type="tool"
            title="With comment"
            data-state={mComment ? "selected" : undefined}
            onClick={() => setMComment(!mComment)}
          >
            <FaCommentDots size={16} />
          </Button>
        </div>

        <div className={flexRowStyle({})} style={{ gap: "0px" }}>
          <Button type="normal" title="Switch dice type" onClick={switchDice}>
            <FaDice size={18} />
          </Button>
          <Button type="normal" title="Reset pool" onClick={reset}>
            <FaReply size={16} />
          </Button>
          <Button title="Clear list" onClick={clear} type="normal">
            <FaTrashAlt size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
