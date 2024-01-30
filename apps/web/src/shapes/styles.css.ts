import { style } from "@vanilla-extract/css";

export const actionButtonStyle = style({
  minHeight: 30,
  minWidth: 30,
  width: 30,
  height: 30,
});

export const cardButtonStyle = style({
  selectors: {
    "&:hover": {
      fillOpacity: 0.8,
      border: "solid 1px",
    },
  },
});
