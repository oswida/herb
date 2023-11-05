import { useEffect, useMemo, useState } from "react";
import {
  diceRollerSelectorStyle,
  diceRollerSelectorValueStyle,
} from "./style.css";
import { flexColumnStyle, flexRowStyle } from "../../common";
import {
  FaCommentDots,
  FaDiceD20,
  FaTrashAlt,
  FaUserSecret,
} from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { VscRequestChanges } from "react-icons/vsc";
import { RxReset } from "react-icons/rx";
import { Button, getUserPreferences, useEditor } from "@tldraw/tldraw";
import { useChat, useRoll } from "../../hooks";

export const DiceRollerSelector = () => {
  const MAX_DICE_POOL = 99;
  const [selectedDice, setSelectedDice] = useState<Record<string, number>>({});
  const faces = ["4", "6", "8", "10", "12", "20", "100"];
  const [mPrivate, setMPrivate] = useState(false);
  const [mMod, setMMod] = useState(false);
  const [mComment, setMComment] = useState(false);
  const editor = useEditor();
  const { addChatMessage, clearChat } = useChat(editor);
  const user = getUserPreferences();
  const { rollSingleToChat } = useRoll(user);

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
    if (notation.trim() === "") return;
    const msg = rollSingleToChat(notation);
    addChatMessage(msg);
  };

  const reset = () => {
    const rr: Record<string, number> = {};
    faces.forEach((it) => (rr[it] = 0));
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
    clearChat();
  };

  return (
    <div className={flexColumnStyle}>
      <div
        className={flexRowStyle}
        style={{
          justifyContent: "center",
        }}
      >
        {faces.map((it) => (
          <div
            key={it}
            className={diceRollerSelectorStyle}
            title="Click to increase. Shift+click to decrease."
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
        <Button title="Reset pool" smallIcon onClick={reset}>
          <RxReset />
        </Button>
      </div>
      <div
        className={flexRowStyle}
        style={{
          gap: 0,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className={flexRowStyle}
          style={{ gap: "0px", borderRight: "solid 1px var(--color-text-3)" }}
        >
          <Button
            title="Private roll"
            data-state={mPrivate ? "selected" : undefined}
            onClick={() => setMPrivate(!mPrivate)}
          >
            <FaUserSecret />
          </Button>
          <Button
            title="With modifier"
            data-state={mMod ? "selected" : undefined}
            onClick={() => setMMod(!mMod)}
          >
            <VscRequestChanges />
          </Button>
          <Button
            title="With comment"
            data-state={mComment ? "selected" : undefined}
            onClick={() => setMComment(!mComment)}
          >
            <FaCommentDots />
          </Button>
        </div>
        <div
          className={flexRowStyle}
          style={{
            gap: "0px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              maxWidth: "100px",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              color: "var(--color-text)",
            }}
          >
            {notation}
          </div>
          <Button title="Roll" onClick={roll}>
            <FaDiceD20 />
          </Button>
        </div>
        <div
          className={flexRowStyle}
          style={{ gap: "0px", borderLeft: "solid 1px var(--color-text-3)" }}
        >
          <Button title="Custom roll" onClick={roll}>
            <MdDashboardCustomize />
          </Button>
          <Button title="Clear list" onClick={clear}>
            <FaTrashAlt />
          </Button>
        </div>
      </div>
    </div>
  );
};
