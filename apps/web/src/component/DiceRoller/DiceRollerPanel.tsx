import { getUserPreferences, track, useEditor } from "@tldraw/tldraw";
import { diceRollerVisible } from "../../common/state";
import { useAtomValue } from "jotai";
import { diceRollerListStyle, diceRollerRootStyle } from "./style.css";
import { useChat } from "../../hooks";
import { DiceRollerSelector } from "./DiceRollerSelector";
import React, { useEffect, useMemo, useRef } from "react";
import { DiceRollerItem } from "./DiceRollerItem";

export const DiceRollerPanel = track(({ isOwner }: { isOwner: boolean }) => {
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
          <DiceRollerSelector isOwner={isOwner} />
        </div>
      )}
    </>
  );
});
