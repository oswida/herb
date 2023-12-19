import React from "react";
import { DiceProps } from "./props";

export const D8Svg = ({ fill, value, background, size }: DiceProps) => {
  if (value < 1 || value > 8) return <div>Bad dice value {value}</div>;
  return (
    <svg
      version="1.1"
      viewBox="0 0 369.05 445.33"
      xmlns="http://www.w3.org/2000/svg"
      height={size}
    >
      <g fill={fill}>
        <path d="m6.3628 306.75h355.65l-177.23-305.76z" />
        <path d="m210.21 13.149 158.34 114.31-0.28225 157.21z" />
        <path d="m158 13.149-157.5 114.31v157.78z" />
        <path d="m17.717 323.06 166.81 121.65 167.09-121.37z" />
      </g>
      <text x="125.22911" y="266.6474" fill={background} fontSize="200.33px">
        {value}
      </text>
    </svg>
  );
};
