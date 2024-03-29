import { getDefaultColorTheme, useEditor } from "@tldraw/tldraw";
import React, { ReactNode } from "react";
import { diceMarkerStyle } from "./style.css";
import { BsDice5Fill } from "react-icons/bs";
import { GiCardAceHearts } from "react-icons/gi";
import { D10Icon, D12Icon, D20Icon, D4Icon, D6Icon, D8Icon } from "../Icons";
import { PiPercentFill, PiPlusMinusFill, PiCoinFill } from "react-icons/pi";

const Ms = ({ title, children }: { title: string; children: ReactNode }) => {
  const editor = useEditor();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });
  return (
    <div
      title={title}
      className={diceMarkerStyle}
      style={{
        backgroundColor: "var(--color-primary)",
        color: "#eee",
      }}
    >
      {children}
    </div>
  );
};

export const RollMarker = ({ id }: { id?: string }) => {
  if (!id || id === "") return null;
  switch (id) {
    case "trophy_dark":
      return (
        <Ms title="Trophy Dark">
          <BsDice5Fill fill="black" size={16} />
        </Ms>
      );
    case "trophy_light":
      return (
        <Ms title="Trophy Light">
          <BsDice5Fill fill="white" size={16} />
        </Ms>
      );
    case "fate":
      return (
        <Ms title="FATE">
          <PiPlusMinusFill size="1.2rem" />
        </Ms>
      );
    case "d2":
      return (
        <Ms title="d2/coin">
          <PiCoinFill size="1.2rem" />
        </Ms>
      );
    case "d4":
      return (
        <Ms title="d4">
          <D4Icon size="18px" />
        </Ms>
      );
    case "d6":
      return (
        <Ms title="d6">
          <D6Icon size="20px" />
        </Ms>
      );
    case "d8":
      return (
        <Ms title="d8">
          <D8Icon size="20px" />
        </Ms>
      );
    case "d10":
      return (
        <Ms title="d10">
          <D10Icon size="20px" />
        </Ms>
      );
    case "d12":
      return (
        <Ms title="d12">
          <D12Icon size="20px" />
        </Ms>
      );
    case "d20":
      return (
        <Ms title="d20">
          <D20Icon size="20px" />
        </Ms>
      );
    case "d100":
      return (
        <Ms title="d100">
          <PiPercentFill size="1.2rem" />
        </Ms>
      );
    case "card":
      return (
        <Ms title="card">
          <GiCardAceHearts size="1.2rem" />
        </Ms>
      );
    default:
      return <></>;
  }
};
