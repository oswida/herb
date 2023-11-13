import { style } from "@vanilla-extract/css";
import { appPanelStyle } from "../../common";

export const assetListRootStyle = style([
    appPanelStyle,
    {
        position: "absolute",
        right: "10px",
        top: "300px",
        width: "350px",
        padding: "5px",
        height: "calc(100vh - 350px)",
        flexDirection: "column",
    },
]);

export const assetListStyle = style([
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