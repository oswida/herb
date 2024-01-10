import {
  DiceRoll,
  DiceRoller,
  NumberGenerator,
} from "@dice-roller/rpg-dice-roller";
import { ChatMsg, prettyNow, rollValues } from "../common";
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

  const filterExt = (notation: string) => {
    return notation
      .replaceAll("Td", "6")
      .replaceAll("Tl", "6")
      .replaceAll("PC", "52");
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
          if (p.includes("dPC")) m = "card";
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
      const result = roller.roll(filterExt(notation)) as DiceRoll;
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

  const rollSimple = (notation: string) => {
    const r = rollValues("white", roller.roll(notation) as DiceRoll);
    const res: number[] = [];
    r.forEach((it) => {
      it.forEach((v) => res.push(v.value));
    });
    return res;
  };

  return { rollSingleToChat, rollSimple };
};
