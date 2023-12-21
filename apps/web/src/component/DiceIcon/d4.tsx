import React from "react";
import { DiceProps } from "./props";

export const D4Svg = ({ fill, value, background }: DiceProps) => {
  if (value < 1 || value > 4) return <div>Bad dice value {value}</div>;
  return (
    <svg
      version="1.1"
      viewBox="0 0 461.9 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(120 226.88 268.34)">
        <path d="m-8.0385 398.12 231.4-400.26 230.95 400.54z" fill={fill} />
        <text
          transform="matrix(-.50851 -.88076 .85153 -.49163 0 0)"
          x="-401.62543"
          y="101.24477"
          fill={background}
          fontSize="240px"
          fontWeight="bold"
        >
          {value}
        </text>
      </g>
    </svg>
  );
};
