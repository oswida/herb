import { style } from "@vanilla-extract/css";
import { appPanelStyle, flexColumnStyle } from "../../common";
import { recipe } from "@vanilla-extract/recipes";

export const diceRollerRootStyle = style([
  appPanelStyle,
  {
    position: "absolute",
    left: "10px",
    top: "50px",
    width: "350px",
    padding: "5px",
    height: "calc(100vh - 110px)",
    flexDirection: "column",
  },
]);

export const diceRollerListStyle = style([
  {
    width: "100%",
    height: "calc(100vh - 170px)",
    backgroundColor: "var(--color-background)",
    borderRadius: "var(--radius-4)",
    padding: "5px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    overflow: "auto",
    scrollbarWidth: "thin",
  },
]);

export const diceRollerItemStyle = style([
  flexColumnStyle({}),
  {
    borderRadius: "var(--radius-2)",
    border: "solid 1px var(--color-text-3)",
    padding: "5px",
    fontFamily: "var(--tl-font-serif)",
    fontSize: "15px",
  },
]);

export const diceRollerSelectorStyle = style([
  {
    border: "1px solid var(--color-text)",
    borderRadius: "50%",
    fontSize: "17px",
    fontWeight: "normal",
    padding: "3px",
    width: "2.5rem",
    height: "2.5rem",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--tl-font-sans)",
    cursor: "pointer",
  },
]);

export const diceRollerSelectorValueStyle = style([
  {
    backgroundColor: "var(--color-text-1)",
    color: "var(--color-background)",
    border: "1px solid var(--color-primary)",
    borderRadius: "50%",
    fontSize: "14px",
    position: "absolute",
    left: "calc(50% - 0.75rem)",
    top: "calc(-50% + 0.25rem)",
    width: "1.5rem",
    height: "1.5rem",
    padding: "3px",
    fontWeight: "bolder",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--tl-font-sans)",
  },
]);

export const diceValueStyle = style({
  minWidth: "2rem",
  padding: "3px",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const diceMarkerStyle = style({
  padding: "4px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const diceResultTableObjectStyle = style({
  cursor: "pointer",
  marginRight: 5,
  opacity: 0.5,
  selectors: {
    "&:hover": {
      opacity: 1.0,
    },
  },
});
