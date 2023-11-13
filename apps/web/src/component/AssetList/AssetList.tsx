import { Button, Dialog, TLUiDialogProps } from "@tldraw/tldraw";
import React, { useCallback, useEffect, useState } from "react"
import { ASSET_LIST_URL, assetListVisible } from "../../common";
import { assetListRootStyle, assetListStyle } from "./style.css";
import { useAtomValue } from "jotai";


export const AssetList = () => {
    const [data, setData] = useState<string[]>([]);
    const visible = useAtomValue(assetListVisible);

    const getData = async () => {
        const result = await fetch(ASSET_LIST_URL, {
            method: "GET",
        });
        const json = await result.json();
        console.log(json);
        setData(json);
    };

    useEffect(() => {
        // let ignore = false;
        getData();
        // return () => { ignore = true };
    }, []);

    if (!visible) return null;

    return <div className={assetListRootStyle}>
        <div style={{ padding: "2px 5px" }}>Assets</div>
        <div className={assetListStyle}>
            {data.map((it) => (
                <div key={it}>{it}</div>
            ))}
        </div>
    </div>
}