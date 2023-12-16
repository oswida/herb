import {
  getUserPreferences,
  stopEventPropagation,
  track,
  useEditor,
} from "@tldraw/tldraw";
import { animatedRollNotation, diceRollerVisible } from "../../common/state";
import { useAtomValue, useSetAtom } from "jotai";
import { diceRollerListStyle, diceRollerRootStyle } from "./style.css";
import { useChat } from "../../hooks";
import { DiceRollerSelector } from "./DiceRollerSelector";
import React, { useEffect, useMemo, useRef } from "react";
import { DiceRollerItem } from "./DiceRollerItem";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";

export const DiceRollerPanel = track(({ isOwner }: { isOwner: boolean }) => {
  const visible = useAtomValue(diceRollerVisible);
  const editor = useEditor();
  const { chatList } = useChat(editor);
  const user = getUserPreferences();
  const ref = useRef<HTMLDivElement>(null);
  const setAnimatedRoll = useSetAtom(animatedRollNotation);

  const list = useMemo(() => {
    return Object.values(chatList).filter(
      (it) => !it.priv || (it.priv && it.userId === user.id)
    );
  }, [chatList]);

  const rollNotationWithResults = (result: DiceRoll) => {
    try {
      const values: number[] = [];
      const dice = result.notation.split("+");
      const tr = result.rolls.filter((r: any) => r !== "+");
      const faces: string[] = [];
      dice.forEach((d) => {
        const idx = d.indexOf("d");
        if (idx) faces.push(d.substring(idx + 1));
      });
      for (let i = 0; i < faces.length; i++) {
        if (
          typeof tr[i] === "object" &&
          faces[i] !== "52" &&
          faces[i] !== "F"
        ) {
          if (faces[i] === "100") {
            const tens: number[] = [];
            const ones: number[] = [];
            (tr[i] as any).rolls.forEach((it: any) => {
              const num = Number.parseInt(it.value);
              if (num > 10) {
                const tns = Math.floor(num / 10);
                tens.push(10 * tns);
                ones.push(num - 10 * tns);
              } else {
                tens.push(0);
                ones.push(it.value);
              }
            });
            values.push(...tens);
            values.push(...ones);
          } else {
            (tr[i] as any).rolls.forEach((it: any) => values.push(it.value));
          }
        }
      }

      const nots: string[] = [];
      dice.forEach((d) => {
        const parts = d.split("d");
        if (parts[1] === "F" || parts[1] === "52") return;
        if (parts[1] === "100") {
          nots.push(d);
          nots.push(`${parts[0]}d10`);
        } else nots.push(d);
      });
      return `${nots.join("+")}@${values.join(",")}`;
    } catch (e: any) {
      console.error(e);
      return result.notation;
    }
  };

  useEffect(() => {
    if (!ref.current || !visible) return;
    ref.current.scrollIntoView({ block: "end", behavior: "smooth" });
    if (list.length > 0) {
      const item = list[list.length - 1];
      const roll = item.roll;
      if (!roll || item.priv) return;
      setAnimatedRoll(rollNotationWithResults(roll));
    }
  }, [list, visible]);

  return (
    <>
      {visible && (
        <div
          id="diceroller"
          className={diceRollerRootStyle}
          onPointerDown={stopEventPropagation}
          onPointerUp={stopEventPropagation}
        >
          <div
            className={diceRollerListStyle}
            onWheelCapture={stopEventPropagation}
          >
            {list?.map((it) => (
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
