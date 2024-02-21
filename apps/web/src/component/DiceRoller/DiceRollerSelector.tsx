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
  FaReply,
  FaTrashAlt,
  FaUserSecret,
} from "react-icons/fa";
import { VscRequestChanges } from "react-icons/vsc";
import {
  TldrawUiButton,
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
import { PiCoinFill, PiPlusMinusFill } from "react-icons/pi";
import { BsDice5Fill } from "react-icons/bs";
import { GiCardAceHearts } from "react-icons/gi";

const Face = ({ faceType }: { faceType: string }) => {
  switch (faceType) {
    case "2":
      return <PiCoinFill size="1.2rem" />;
    case "F":
      return <PiPlusMinusFill size="1.2rem" />;
    case "Td":
      return <BsDice5Fill fill="black" />;
    case "Tl":
      return <BsDice5Fill fill="white" />;
    case "PC":
      return <GiCardAceHearts size="1.2rem" />;
    default:
      return <span>{faceType}</span>;
  }
};

export const DiceRollerSelector = ({ isOwner }: { isOwner: boolean }) => {
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
    F: "FATE",
    Td: "Trophy dark",
    Tl: "Trophy light",
    "2": "d2/coin",
    PC: "Playing cards",
  };
  const [currentFace, setCurrentFace] = useState<Record<string, string>>(faces);
  const [mPrivate, setMPrivate] = useState(false);
  const [mMod, setMMod] = useState(false);
  const [mComment, setMComment] = useState(false);
  const editor = useEditor();
  const { addChatMessage, clearChat } = useChat(editor);
  const user = getUserPreferences();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
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
          void null;
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
          notation="custom"
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
                onPointerDown={(e) => inc(e, it)}
              >
                {/* <span>{it}</span> */}
                <Face faceType={it} />
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
          alignItems: "center",
        }}
      >
        <TldrawUiButton
          title="Roll"
          type="normal"
          onPointerDown={roll}
          disabled={notation.trim() === ""}
        >
          <FaDiceD20 size={24} fill={"var(--color-accent)"} />
          <div
            style={{
              color: "var(--color-accent)",
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            ROLL
          </div>
          <div
            style={{
              fontSize: 14,
              overflowWrap: "break-word",
              wordWrap: "break-word",
              color: "var(--color-text)",
              marginLeft: "10px",
              maxWidth: "160px",
            }}
          >
            {notation}
          </div>
        </TldrawUiButton>

        <TldrawUiButton
          title="Custom roll"
          onPointerDown={rollCustom}
          type="normal"
        >
          <FaDiceD6 size={20} />
        </TldrawUiButton>
      </div>

      {/* Actions */}
      <div
        className={flexRowStyle({ justify: "space" })}
        style={{
          gap: 0,
        }}
      >
        <div className={flexRowStyle({})} style={{ gap: "0px" }}>
          <TldrawUiButton
            type="tool"
            title="Private roll"
            data-state={mPrivate ? "selected" : undefined}
            onPointerDown={() => setMPrivate(!mPrivate)}
          >
            <FaUserSecret size={16} />
          </TldrawUiButton>
          <TldrawUiButton
            type="tool"
            title="With modifier"
            data-state={mMod ? "selected" : undefined}
            onPointerDown={() => setMMod(!mMod)}
          >
            <VscRequestChanges size={16} />
          </TldrawUiButton>
          <TldrawUiButton
            type="tool"
            title="With comment"
            data-state={mComment ? "selected" : undefined}
            onPointerDown={() => setMComment(!mComment)}
          >
            <FaCommentDots size={16} />
          </TldrawUiButton>
        </div>

        <div className={flexRowStyle({})} style={{ gap: "0px" }}>
          <TldrawUiButton
            type="normal"
            title="Switch dice type"
            onPointerDown={switchDice}
          >
            <FaDice size={18} />
          </TldrawUiButton>
          <TldrawUiButton
            type="normal"
            title="Reset pool"
            onPointerDown={reset}
          >
            <FaReply size={16} />
          </TldrawUiButton>
          {isOwner && (
            <TldrawUiButton
              title="Clear list"
              onPointerDown={clear}
              type="normal"
            >
              <FaTrashAlt size={16} />
            </TldrawUiButton>
          )}
        </div>
      </div>
    </div>
  );
};
