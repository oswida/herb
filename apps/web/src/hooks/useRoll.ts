import { DiceRoll, DiceRoller } from "@dice-roller/rpg-dice-roller";
import { ChatMsg, prettyNow } from "../common";
import { v4 } from "uuid";
import { TLUserPreferences } from "@tldraw/tldraw";
import { useCallback } from "react";

export const useRoll = (user: TLUserPreferences) => {
  const roller = new DiceRoller();

  const rollSingle = (notation: string) => {
    const result = roller.roll(notation) as DiceRoll;
    return result;
  };

  const rollMultiple = (notations: string[]) => {
    const result = roller.roll(...notations) as DiceRoll[];
    return result;
  };

  const rollSingleToChat = useCallback(
    (notation: string, comment?: string) => {
      const result = roller.roll(notation) as DiceRoll;
      return {
        id: v4(),
        userId: user.id,
        userName: user.name,
        roll: result,
        comment: comment,
        tstamp: prettyNow(),
      } as ChatMsg;
    },
    [user, user.id, user.name]
  );

  return { rollSingle, rollMultiple, rollSingleToChat };
};
