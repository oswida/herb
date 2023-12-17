import { style } from "@vanilla-extract/css";
import { appPanelStyle } from "../../common";

export const drawBoardViewRoottyle = style({
  position: "fixed",
  inset: "0px",
  overflow: "hidden",
});

export const actionsRootStyle = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const actionsPanelStyle = style([
  appPanelStyle,
  {
    padding: 2,
    gap: 4,
  },
]);

export const actionsInfoStyle = style({
  display: "flex",
  flexDirection: "row",
  gap: 2,
  padding: 2,
  paddingRight: 5,
  alignItems: "center",
  justifyContent: "center",
});

export const diceAnimatorRootStyle = style({
  position: "absolute",
  left: 350,
  top: -630, //TODO: set to 30
  width: "calc(100vw - 350px)",
  height: "calc(100vh - 60px)",
  backgroundColor: "transparent",
  zIndex: 0,
  pointerEvents: "none",
  userSelect: "unset",
});
