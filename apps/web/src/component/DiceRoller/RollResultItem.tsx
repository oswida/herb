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
          (tr[i] as any).rolls.forEach((e: any) => {
            a.push({
              dice: faces[i].toLowerCase(),
              value: e.value,
            } as RollValue);
          });
          rslt.push(a);
        }
      }
    }
    return rslt;
  }, [props.roll]);

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
          <div className={flexRowStyle({})}>
            <RollMarker id={props.markers ? props.markers[idx] : ""} />
            <div className={flexRowStyle({})} style={{ flexWrap: "wrap" }}>
              {it.map((r) => (
                <div
                  className={diceValueStyle}
                  style={{
                    backgroundColor: `${theme.text}22`,
                    border: `dotted 1px var(--color-text-3)`,
                  }}
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
