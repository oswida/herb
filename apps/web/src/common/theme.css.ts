import { globalStyle, style } from "@vanilla-extract/css";

export const appPanelStyle = style({
  boxShadow: "var(--shadow-2)",
  borderRadius: "var(--radius-4)",
  pointerEvents: "all",
  backgroundColor: "var(--color-panel)",
  height: "fit-content",
  maxHeight: "100%",
  margin: "var(--space-2)",
  overflow: "hidden",
  touchAction: "auto",
  overscrollBehavior: "none",
  overflowY: "auto",
  color: "var(--color-text)",
  zIndex: "var(--layer-panels)",
  display: "flex",
  flexDirection: "row",
  gap: 8,
});

export const hintStyle = style({
  fontSize: "12px",
  fontFamily: "var(--tl-font-sans)",
});

export const flexColumnStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
});

export const flexRowStyle = style({
  display: "flex",
  flexDirection: "row",
  gap: "5px",
});

globalStyle("html, body", {
  padding: 0,
  margin: 0,
  fontFamily: `"Inter", sans-serif`,
  overscrollBehavior: "none",
  touchAction: "none",
  minHeight: "100vh",
  fontSize: "16px",
  height: "100%",
});

globalStyle("html", {
  boxSizing: "border-box",
});

globalStyle(".hidden_tlui", {
  display: "none",
});
