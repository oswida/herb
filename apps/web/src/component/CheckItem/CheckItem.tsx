import React from "react";
import { flexRowStyle } from "../../common";
import { FaCheckSquare, FaSquare } from "react-icons/fa";
import { BsCheckSquare, BsSquare } from "react-icons/bs";

type CheckItemProps = {
  label: string;
  checked: boolean;
};

export const CheckItem = ({ checked, label }: CheckItemProps) => {
  return (
    <div className={flexRowStyle({ justify: "start" })}>
      {checked && <BsCheckSquare />}
      {!checked && <BsSquare />}
      <div>{label}</div>
    </div>
  );
};
