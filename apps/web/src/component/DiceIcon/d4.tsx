import React from "react";
import { DiceProps } from "./props";

export const D4Svg = ({ fill, value, background }: DiceProps) => {
  if (value < 1 || value > 4) return <div>Bad dice value {value}</div>;
  console.log(fill, background);
  switch (value) {
    case 1:
      return (
        <svg viewBox="0 0 461.89999 400" xmlns="http://www.w3.org/2000/svg">
          <path
            stroke={fill}
            fill={fill}
            transform="matrix(1.5991 0 0 1.5992 29.473 186.11)"
            d="m270.39 134.35-289.12-0.16794 144.71-250.3z"
          />
          <g
            fill={background}
            font-family="sans-serif"
            font-size="198.35px"
            letter-spacing="0px"
            stroke-width="4.9588"
            word-spacing="0px"
          >
            <text transform="scale(1.017 .98325)" x="160.09076" y="214.48213">
              1
            </text>
            <text
              transform="matrix(-.7571 -.67909 .65653 -.73195 0 0)"
              x="-365.10748"
              y="-98.445053"
            >
              4
            </text>
            <text
              transform="matrix(-.67909 .7571 -.73195 -.65653 0 0)"
              x="-42.878056"
              y="-389.1286"
            >
              2
            </text>
          </g>
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 461.89999 400" xmlns="http://www.w3.org/2000/svg">
          <path
            stroke={fill}
            fill={fill}
            transform="matrix(1.5991 0 0 1.5992 29.473 186.11)"
            d="m270.39 134.35-289.12-0.16794 144.71-250.3z"
          />
          <g
            fill={background}
            font-family="sans-serif"
            font-size="198.35px"
            letter-spacing="0px"
            stroke-width="4.9588"
            word-spacing="0px"
          >
            <text transform="scale(1.017 .98325)" x="160.09076" y="214.48213">
              2
            </text>
            <text
              transform="matrix(-.7571 -.67909 .65653 -.73195 0 0)"
              x="-365.10748"
              y="-98.445053"
            >
              4
            </text>
            <text
              transform="matrix(-.67909 .7571 -.73195 -.65653 0 0)"
              x="-42.878056"
              y="-389.1286"
            >
              1
            </text>
          </g>
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 461.89999 400" xmlns="http://www.w3.org/2000/svg">
          <path
            stroke={fill}
            fill={fill}
            id="path44"
            d="M 270.39471,134.35061 -18.725399,134.18267 125.98009,-116.11872 Z"
            transform="matrix(1.5991205,0,0,1.5991793,29.472708,186.10991)"
          />
          <text
            fontSize={126.72}
            strokeWidth={3.168}
            stroke={background}
            x="190.88806"
            y="182.28175"
            id="text44"
            transform="scale(1.0170327,0.98325256)"
          >
            3
          </text>
          <text
            fontSize={126.72}
            strokeWidth={3.168}
            stroke={background}
            x="-348.26266"
            y="-111.08784"
            transform="matrix(-0.71915072,-0.71915072,0.69526455,-0.69526455,0,0)"
          >
            4
          </text>
          <text
            fontSize={126.72}
            strokeWidth={3.168}
            stroke={background}
            x="-44.827587"
            y="-448.06326"
            transform="matrix(-0.71915072,0.71915072,-0.69526455,-0.69526455,0,0)"
          >
            1
          </text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 461.89999 400" xmlns="http://www.w3.org/2000/svg">
          <path
            stroke={fill}
            fill={fill}
            id="path44"
            d="M 270.39471,134.35061 -18.725399,134.18267 125.98009,-116.11872 Z"
            transform="matrix(1.5991205,0,0,1.5991793,29.472708,186.10991)"
          />
          <text
            fontSize={180}
            strokeWidth={3.168}
            stroke={background}
            x="170.88806"
            y="220.28175"
            id="text44"
            transform="scale(1.0170327,0.98325256)"
          >
            4
          </text>
          <text
            fontSize={180}
            strokeWidth={3.168}
            stroke={background}
            x="-348.26266"
            y="-111.08784"
            transform="matrix(-0.71915072,-0.71915072,0.69526455,-0.69526455,0,0)"
          >
            2
          </text>
          <text
            fontSize={180}
            strokeWidth={3.168}
            stroke={background}
            x="-64.827587"
            y="-448.06326"
            transform="matrix(-0.71915072,0.71915072,-0.69526455,-0.69526455,0,0)"
          >
            1
          </text>
        </svg>
      );
  }
  return <div></div>;
};
