import React from "react";
import { DiceProps } from "./props";

export const D12Svg = ({ fill, value, background }: DiceProps) => {
  if (value < 1 || value > 12) return <div>Bad dice value {value}</div>;
  return (
    <svg
      version="1.1"
      viewBox="0 0 400.99 418.84"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={fill}>
        <path d="m6.4874 135.01 88.214 28.54 96.397-70.053-0.09978-92.605-114.06 37.022z" />
        <path d="m88.565 181.76 36.922 113.41-54.436 74.942-70.552-97.096v-119.9z" />
        <path d="m86.619 381.19 54.485-75.042 119.15 0.39916 54.286 74.843-113.96 36.922z" />
        <path d="m275.31 295.07 54.474 75.078 70.703-96.953v-120.24l-88.344 28.789z" />
        <path d="m394.71 134.9-88.062 28.931-96.67-70.421 0.14112-92.719 114.03 37.116z" />
        <path d="m107.38 177.62 93.404-67.458 92.805 67.458-35.525 109.57h-114.96z" />
      </g>
      <text
        x="197.10989"
        y="253.05945"
        fill={background}
        fontSize="120px"
        fontWeight="bold"
        textAnchor="middle"
      >
        {value}
      </text>
    </svg>
  );
};
