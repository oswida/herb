import { style } from "@vanilla-extract/css";
import { appPanelStyle } from "../../common";
import { recipe } from "@vanilla-extract/recipes";

export const customSettingsRootStyle = style([
  appPanelStyle,
  {
    position: "absolute",
    right: "5px",
    top: "50px",
    width: "200px",
    padding: "5px",
    // height: "calc(100vh - 320px)",
    flexDirection: "column",
    pointerEvents: "all",
  },
]);
