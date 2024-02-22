import {
  TLInstancePresence,
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
import { rollNotationWithResults } from "../../common";
import { WebsocketProvider } from "y-websocket";

type Props = {
  isOwner: boolean;
  roomProvider: WebsocketProvider;
};

export const DiceRollerPanel = track(({ isOwner, roomProvider }: Props) => {
  const visible = useAtomValue(diceRollerVisible);
  const editor = useEditor();
  const { chatList } = useChat(editor);
  const user = getUserPreferences();
  const ref = useRef<HTMLDivElement>(null);
  const setAnimatedRoll = useSetAtom(animatedRollNotation);

  const users = useMemo(() => {
    const retv: Record<string, TLInstancePresence> = {};
    if (!roomProvider || !roomProvider.awareness) return retv;
    const states = roomProvider.awareness.getStates() as Map<
      number,
      { presence: TLInstancePresence }
    >;
    states.forEach((it) => {
      if (it && it.presence) retv[it.presence.userId] = it.presence;
    });
    return retv;
  }, [roomProvider]);

  const list = useMemo(() => {
    return Object.values(chatList).filter(
      (it) => !it.priv || (it.priv && it.userId === user.id)
    );
  }, [chatList]);

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
              <DiceRollerItem item={it} key={it.id} users={users} />
            ))}
            <div ref={ref}></div>
          </div>
          <DiceRollerSelector isOwner={isOwner} />
        </div>
      )}
    </>
  );
});
