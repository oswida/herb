import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ASSET_LIST_URL, UPLOAD_URL, assetListVisible, flexColumnStyle, flexRowStyle } from "../../common";
import { assetListRootStyle, assetListStyle } from "./style.css";
import { useAtomValue } from "jotai";
import { AssetItem } from "./AssetItem";
import { AssetRecordType, Button, Input, MediaHelpers, ShapeUtil, TLAsset, TLAssetShape, TLImageShape, getHashForString, imageShapeProps, isGifAnimated, uniqueId, useEditor } from "@tldraw/tldraw";
import { FaBackspace } from "react-icons/fa";
import { iterate } from "localforage";
import { IPdfShape } from "../../shapes";

type AssetDesc = {
    filename: string;
    mime: string;
}

export const AssetList = () => {
    const [data, setData] = useState<AssetDesc[]>([]);
    const visible = useAtomValue(assetListVisible);
    const [filter, setFilter] = useState("");
    const filterRef = useRef<HTMLInputElement>();
    const [sel, setSel] = useState<AssetDesc | undefined>(undefined);
    const editor = useEditor();

    const getData = useCallback(async (flt: string) => {
        const result = await fetch(ASSET_LIST_URL, {
            method: "GET",
        });
        const json = await result.json() as AssetDesc[];
        setData(json.filter((it) => flt.trim() == "" || it.filename.includes(flt)));
    }, [filter]);

    const filterChange = async (value: string) => {
        setFilter(value);
        await getData(value);
    }

    useEffect(() => {
        getData(filter);
    }, []);

    const clearFilter = async () => {
        setFilter("");
        if (filterRef.current) filterRef.current.value = "";
        await getData("");

    }

    const isImage = (mime: string) => {
        return ["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(
            mime
        )
    }

    const isPdf = (mime: string) => {
        return ["application/pdf"].includes(
            mime
        )
    }

    const insertAsset = async (asset: AssetDesc) => {
        if (!editor) return;
        if (!isImage(asset.mime) && !isPdf(asset.mime)) return;
        const atype = isImage(asset.mime) ? "image" : (isPdf(asset.mime) ? "pdf" : "undefined");
        const url = `${UPLOAD_URL}/${asset.filename}`;
        const aid = AssetRecordType.createId(
            getHashForString(url)
        );
        const center = editor.getViewportPageCenter();

        switch (atype) {
            case "image": {
                const size = await MediaHelpers.getImageSizeFromSrc(url);
                editor.createShapes<TLImageShape>([
                    {
                        type: 'image',
                        x: center.x - size.w / 2,
                        y: center.y - size.h / 2,
                        props: {
                            w: size.w,
                            h: size.h,
                            assetId: aid,
                        },
                    },
                ])
            }
                break;
            case "pdf":
                editor.createShape<IPdfShape>({
                    type: "pdf",
                    x: center.x - 250,
                    y: center.y - 150,
                    props: {
                        pdf: url,
                        w: 500,
                        h: 300,
                    },
                });
                break;
        }
    }



    if (!visible) return null;

    return <div className={assetListRootStyle}>
        <div style={{ padding: "2px 5px" }}>Assets ({data.length})</div>
        <div className={flexRowStyle({})}>
            <Input className="tlui-embed-dialog__input"
                placeholder="Filter..."
                defaultValue={filter}
                ref={filterRef as any}
                onValueChange={(value) => filterChange(value)} />
            <Button type="icon" onClick={clearFilter}>
                <FaBackspace size={16} />
            </Button>
        </div>
        <div className={assetListStyle}>
            {data.map((it) => (
                <AssetItem key={it.filename} filename={it.filename} onClick={() => setSel(it)} selected={sel?.filename == it.filename} />
            ))}
        </div>
        <div className={flexRowStyle({ justify: "center" })} style={{ gap: "10px" }}>
            <Button type="normal" onClick={() => sel ? insertAsset(sel) : undefined}>
                Insert
            </Button>
            <Button type="normal" >
                Rename
            </Button>
            <Button type="normal">
                Delete
            </Button>

            {/* <div style={{ paddingRight: "10px" }}>
                {sel && isImage(sel.mime) && (
                    <img src={`${UPLOAD_URL}/${sel?.filename}`} style={{ height: "100px" }} />
                )}
            </div> */}
        </div>
    </div>
}