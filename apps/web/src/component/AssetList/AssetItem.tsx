import React from "react";
import { assetItemStyle } from "./style.css";

interface AssetItemProps {
  filename: string;
  onClick: () => void;
  selected: boolean;
}

export const AssetItem = ({ filename, onClick, selected }: AssetItemProps) => {
  return (
    <div className={assetItemStyle({ selected })} onClick={onClick}>
      {filename}
    </div>
  );
};
