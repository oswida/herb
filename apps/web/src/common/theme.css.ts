import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

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

export const flexColumnStyle = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
});

export const flexRowStyle = recipe({
  base: {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    alignItems: "center",
  },
  variants: {
    justify: {
      center: {
        justifyContent: "center",
      },
      space: {
        justifyContent: "space-between",
      },
      end: {
        justifyContent: "end",
      },
      start: {
        justifyContent: "start",
      },
    },
  },
  defaultVariants: {
    justify: "start",
  },
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

globalStyle("[data-color-mode*='dark'] .w-color-compact", {
  "--compact-background-color": "#323232 !important",
});

globalStyle(".short_input", {
  maxWidth: "5em",
});

globalStyle(".tlui-input__wrapper", {
  justifyContent: "flex-end",
});
