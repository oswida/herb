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
              backgroundColor: `${theme.grey.semi}`,
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
                    backgroundColor: `${theme.grey.semi}`,
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
