import {
  DiceRoll,
  DiceRoller,
  NumberGenerator,
} from "@dice-roller/rpg-dice-roller";
import { ChatMsg, prettyNow } from "../common";
import { v4 } from "uuid";
import { TLDefaultColorTheme, TLUserPreferences } from "@tldraw/tldraw";
import { useCallback } from "react";

export const useRoll = (
  user: TLUserPreferences,
  theme: TLDefaultColorTheme
) => {
  const engines = NumberGenerator.engines;
  const generator = NumberGenerator.generator;
  generator.engine = engines.browserCrypto;
  const roller = new DiceRoller();

  const filterTrophy = (notation: string) => {
    return notation.replaceAll("Td", "6").replaceAll("Tl", "6");
  };

  const makeMarkers = useCallback(
    (notation: string) => {
      const rslt: string[] = [];
      const parts = notation.split("+");
      parts.forEach((p) => {
        let m = "";
        if (!p.includes("d")) {
          m = "modifier";
        } else {
          if (p.includes("Td")) m = "trophy_dark";
          if (p.includes("Tl")) m = "trophy_light";
          if (p.includes("dF")) m = "fate";
          const i = p.indexOf("d");
          if (i && m === "") {
            m = p.substring(i);
          }
        }
        rslt.push(m);
      });
      return rslt;
    },
    [theme]
  );

  const rollSingleToChat = useCallback(
    (notation: string, priv: boolean, comment?: string) => {
      const result = roller.roll(filterTrophy(notation)) as DiceRoll;
      return {
        id: v4(),
        userId: user.id,
        userName: user.name,
        roll: result,
        rollMarkers: makeMarkers(notation),
        comment: comment,
        tstamp: prettyNow(),
        priv: priv,
      } as ChatMsg;
    },
    [user, user.id, user.name]
  );

  return { rollSingleToChat };
};
