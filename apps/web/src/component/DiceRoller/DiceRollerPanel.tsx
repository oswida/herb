import {
  getUserPreferences,
  track,
  useEditor,
  useToasts,
} from "@tldraw/tldraw";
import { diceRollerVisible } from "../../common/state";
import { useAtomValue } from "jotai";
import {
  diceRollerItemStyle,
  diceRollerListStyle,
  diceRollerRootStyle,
} from "./style.css";
import { useChat } from "../../hooks";
import { DiceRollerSelector } from "./DiceRollerSelector";
import { flexRowStyle } from "../../common";
import React, { useEffect, useMemo, useRef } from "react";
import { DiceRollerItem } from "./DiceRollerItem";

export const DiceRollerPanel = track(() => {
  const visible = useAtomValue(diceRollerVisible);
  const editor = useEditor();
  const { chatList } = useChat(editor);
  const user = getUserPreferences();
  const ref = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    return Object.values(chatList).filter(
      (it) => !it.priv || (it.priv && it.userId === user.id)
    );
  }, [chatList]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [list.length]);

  return (
    <>
      {visible && (
        <div id="diceroller" className={diceRollerRootStyle}>
          <div className={diceRollerListStyle}>
            {list?.map((it, index) => (
              <DiceRollerItem item={it} key={it.id} />
            ))}
            <div ref={ref}></div>
          </div>
          <DiceRollerSelector />
        </div>
      )}
    </>
  );
});
