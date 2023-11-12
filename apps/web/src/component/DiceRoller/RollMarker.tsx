import { getDefaultColorTheme, useEditor } from "@tldraw/tldraw";
import React from "react";
import { diceMarkerStyle } from "./style.css";
import { BsDice5Fill } from "react-icons/bs";
import { D10Icon, D12Icon, D20Icon, D4Icon, D6Icon, D8Icon } from "../Icons";
import { PiPercentFill } from "react-icons/pi";

export const RollMarker = ({ id }: { id?: string }) => {
  const editor = useEditor();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.isDarkMode,
  });
  if (!id || id === "") return null;
  switch (id) {
    case "trophy_dark":
      return (
        <div
          className={diceMarkerStyle}
          style={{ backgroundColor: `${theme.text}22` }}
        >
          <BsDice5Fill fill="black" />
        </div>
      );
    case "trophy_light":
      return (
        <div
          className={diceMarkerStyle}
          style={{ backgroundColor: `${theme.text}22` }}
        >
          <BsDice5Fill fill="white" />
        </div>
      );
    case "d4":
      return (
        <div
          title="d4"
          className={diceMarkerStyle}
          style={{ backgroundColor: `${theme.text}22` }}
        >
          <D4Icon />
        </div>
      );
    case "d6":
      return (
        <div
          title="d6"
          className={diceMarkerStyle}
          style={{ backgroundColor: `${theme.text}22` }}
        >
          <D6Icon />
        </div>
      );
    case "d8":
      return (
        <div
          title="d8"
          className={diceMarkerStyle}
          style={{ backgroundColor: `${theme.text}22` }}
        >
          <D8Icon />
        </div>
      );
    case "d10":
      return (
        <div
          title="d10"
          className={diceMarkerStyle}
          style={{ backgroundColor: `${theme.text}22` }}
        >
          <D10Icon />
        </div>
      );
    case "d12":
      return (
        <div
          title="d12"
          className={diceMarkerStyle}
          style={{ backgroundColor: `${theme.text}22` }}
        >
          <D12Icon />
        </div>
      );
    case "d20":
      return (
        <div
          title="d20"
          className={diceMarkerStyle}
          style={{ backgroundColor: `${theme.text}22` }}
        >
          <D20Icon />
        </div>
      );
    case "d100":
      return (
        <div
          title="d100"
          className={diceMarkerStyle}
          style={{ backgroundColor: `${theme.text}22` }}
        >
          <PiPercentFill size="1.2rem" />
        </div>
      );
    default:
      return <></>;
  }
};
