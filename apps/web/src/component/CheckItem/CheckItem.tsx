import React from "react";
import { flexRowStyle } from "../../common";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { TldrawUiButton } from "@tldraw/tldraw";

type CheckItemProps = {
  label: string;
  checked: boolean;
  setValue: (v: boolean) => void;
};

export const CheckItem = ({ checked, label, setValue }: CheckItemProps) => {
  return (
    <div className={flexRowStyle({ justify: "start" })}>
      <TldrawUiButton type="icon" onPointerDown={() => setValue(!checked)}>
        {checked && <BsCheckSquare />}
        {!checked && <BsSquare />}
      </TldrawUiButton>
      <div>{label}</div>
    </div>
  );
};
