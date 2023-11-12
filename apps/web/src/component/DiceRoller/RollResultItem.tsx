import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import React, { useMemo } from "react";
import { flexColumnStyle, flexRowStyle } from "../../common";
import { TbSum } from "react-icons/tb";
import { getDefaultColorTheme, useEditor } from "@tldraw/tldraw";
import { diceValueStyle } from "./style.css";
import { RollMarker } from "./RollMarker";

type Props = {
  roll: DiceRoll | undefined;
  markers?: string[];
};

type RollValue = {
  dice: string;
  value: number;
  color: string;
  isMax: boolean;
  isMin: boolean;
};

export const RollResultItem = (props: Props) => {
  const editor = useEditor();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.isDarkMode,
  });

  const itemRolls = useMemo(() => {
    const rslt: RollValue[][] = [];
    if (!props.roll) return rslt;
    const faces = props.roll.notation.split("+");
    const tr = props.roll.rolls.filter((r) => (r as any) !== "+");
    if (faces.length !== tr.length) {
      console.error("Bad roll results");
      return rslt;
    }

    for (let i = 0; i < faces.length; i++) {
      if (faces[i].toLowerCase().includes("d")) {
        if (typeof tr[i] === "object") {
          const a: RollValue[] = [];
          let min = Number.MAX_SAFE_INTEGER;
          let max = 0;
          (tr[i] as any).rolls.forEach((e: any) => {
            a.push({
              dice: faces[i].toLowerCase(),
              value: e.value,
            } as RollValue);
            if (e.value > max) max = e.value;
            if (e.value < min) min = e.value;
          });
          a.forEach((it) => {
            it.isMax = it.value === max;
            it.isMin = it.value === min;
          });
          rslt.push(a);
        }
      }
    }

    return rslt;
  }, [props.roll]);

  const minmaxBorder = (it: RollValue) => {
    if (it.isMax) return "solid 1px var(--color-primary)";
    if (it.isMin) return "solid 1px var(--color-accent)";
    return "solid 1px var(--color-text)";
  };

  return (
    <div className={flexColumnStyle({})}>
      <div className={flexRowStyle({ justify: "space" })}>
        <div
          style={{
            color: "var(--color-primary)",
            wordWrap: "break-word",
            maxWidth: "200px",
          }}
        >
          {props.roll?.notation}
        </div>
        <div className={flexRowStyle({})}>
          <TbSum />
          <div
            className={diceValueStyle}
            style={{
              backgroundColor: `${theme.text}11`,
              border: `dotted 1px var(--color-accent)`,
            }}
          >
            {props.roll?.total}
          </div>
        </div>
      </div>

      <div
        className={flexRowStyle({})}
        style={{ gap: "15px", flexWrap: "wrap" }}
      >
        {itemRolls.map((it, idx) => (
          <div className={flexRowStyle({})} key={`p${idx}`}>
            <RollMarker id={props.markers ? props.markers[idx] : ""} />
            <div className={flexRowStyle({})} style={{ flexWrap: "wrap" }}>
              {it.map((r, ridx) => (
                <div
                  className={diceValueStyle}
                  style={{
                    backgroundColor: `${theme.text}22`,
                    borderBottom: `${minmaxBorder(r)}`,
                  }}
                  key={`r${idx}-${ridx}`}
                >
                  {r.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
