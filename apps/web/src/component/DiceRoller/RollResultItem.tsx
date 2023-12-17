import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import React, { useMemo } from "react";
import {
  RollValue,
  flexColumnStyle,
  flexRowStyle,
  rollValues,
} from "../../common";
import { TbSum } from "react-icons/tb";
import { getDefaultColorTheme, useEditor } from "@tldraw/tldraw";
import { diceValueStyle } from "./style.css";
import { RollMarker } from "./RollMarker";

type Props = {
  roll: DiceRoll | undefined;
  markers?: string[];
};

export const RollResultItem = (props: Props) => {
  const editor = useEditor();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });

  const itemRolls = useMemo(() => {
    return rollValues(theme.text, props.roll, props.markers);
    // const markerValue = (val: number, marker?: string) => {
    //   if (marker === "d2") return `${val - 1}`;
    //   if (marker == "card") return cardSymbol[val - 1];
    //   return `${val}`;
    // };

    // const rslt: RollValue[][] = [];
    // if (!props.roll) return rslt;
    // const dice = props.roll.notation.split("+");
    // const tr = props.roll.rolls.filter((r) => (r as any) !== "+");
    // if (dice.length !== tr.length) {
    //   console.error("Bad roll results");
    //   return rslt;
    // }
    // const faces: string[] = [];
    // dice.forEach((d) => {
    //   const idx = d.indexOf("d");
    //   if (idx) faces.push(d.substring(idx));
    // });

    // for (let i = 0; i < faces.length; i++) {
    //   if (faces[i].toLowerCase().includes("d")) {
    //     if (typeof tr[i] === "object") {
    //       const a: RollValue[] = [];
    //       let min = Number.MAX_SAFE_INTEGER;
    //       let max = -1;
    //       (tr[i] as any).rolls.forEach((e: any) => {
    //         const val: RollValue = {
    //           dice: faces[i].toLowerCase(),
    //           value: e.value,
    //           valueStr: markerValue(
    //             e.value,
    //             props.markers ? props.markers[i] : ""
    //           ),
    //           isMax: false,
    //           isMin: false,
    //           color: theme.text,
    //         };
    //         if (val.value >= max) max = val.value;
    //         if (val.value <= min) min = val.value;
    //         a.push(val);
    //       });
    //       a.forEach((it) => {
    //         it.isMax = it.value === max && faces[i] !== "d52";
    //         it.isMin = it.value === min && faces[i] !== "d52";
    //       });
    //       rslt.push(a);
    //     }
    //   }
    // }

    // return rslt;
  }, [props.roll, props.markers]);

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
                  {r.valueStr}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
