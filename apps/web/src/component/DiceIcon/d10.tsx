import React from "react";
import { DiceProps } from "./props";

export const D10Svg = ({ fill, value, background }: DiceProps) => {
  if (value < 1 || value > 10) return <div>Bad dice value {value}</div>;
  return (
    <svg
      version="1.1"
      viewBox="0 0 460.08 462.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={fill}>
        <path d="m229.87 0.99753 118.69 204.77-118.54 55.18-118.69-55.18z" />
        <path d="m200.8 10.312-107.68 189.67-91.59 23.427z" />
        <path d="m258.95 10.312 108.2 190.2 91.408 22.952z" />
        <path d="m95.452 219.11-84.604 21.91 209.46 219.84 0.0706-183.6z" />
        <path d="m239.32 277.25 0.39917 183.21 211.16-219.21-87.003-21.874z" />
      </g>
      <text
        x="182.29463"
        y="215.13496"
        fill={background}
        fontSize="173.33px"
        fontWeight="bold"
      >
        {value - 1}
      </text>
    </svg>
  );
};
