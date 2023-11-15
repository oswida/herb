import React from "react"
import { assetItemStyle } from "./style.css"

type Props = {
    filename: string;
    onClick: () => void;
    selected: boolean;
}

export const AssetItem = ({ filename, onClick, selected }: Props) => {
    return <div
        onClick={onClick}
        className={assetItemStyle({ selected: selected })}>
        {filename}
    </div>
}