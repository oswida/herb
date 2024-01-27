import React from "react";
import { flexRowStyle } from "../../common";
import { FaCheckSquare, FaSquare } from "react-icons/fa";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { Button } from "@tldraw/tldraw";

type CheckItemProps = {
  label: string;
  checked: boolean;
  setValue: (v: boolean) => void;
};

export const CheckItem = ({ checked, label, setValue }: CheckItemProps) => {
  return (
    <div className={flexRowStyle({ justify: "start" })}>
      <Button type="icon" onPointerDown={() => setValue(!checked)}>
        {checked && <BsCheckSquare />}
        {!checked && <BsSquare />}
      </Button>
      <div>{label}</div>
    </div>
  );
};
