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
    height: "calc(100vh - 320px)",
    flexDirection: "column",
    pointerEvents: "all",
  },
]);

// export const assetListStyle = style([
//   {
//     width: "100%",
//     height: "calc(100vh - 460px)",
//     backgroundColor: "var(--color-background)",
//     borderRadius: "var(--radius-4)",
//     padding: "5px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "5px",
//     overflow: "auto",
//     scrollbarWidth: "thin",
//   },
// ]);

// export const assetItemStyle = recipe({
//   base: {
//     backgroundColor: "var(--color-panel)",
//     borderRadius: "var(--radius-2)",
//     padding: "10px",
//     display: "flex",
//     flexDirection: "row",
//     gap: "5px",
//     cursor: "pointer",
//     selectors: {
//       "&:hover": {
//         borderBottom: "solid 1px var(--color-text)",
//       },
//     },
//   },
//   variants: {
//     selected: {
//       true: {
//         backgroundColor: "var(--color-text-3)",
//       },
//       false: {
//         backgroundColor: "var(--color-panel)",
//       },
//     },
//   },
//   defaultVariants: {
//     selected: false,
//   },
// });
