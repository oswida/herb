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

export const userNotAllowedStyle = style({
  width: "100vw",
  height: "100vh",
  zIndex: 10000,
  background: "var(--color-background)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  left: 0,
  top: 0,
  flexDirection: "column",
});
