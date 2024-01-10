import React from "react";
import { DiceProps } from "./props";

const d6square = (value: number, fill?: string) => {
  return (
    <svg version="1.1" viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.4824" y="3.4824" width="433.04" height="433.04" fill={fill} />
      <text
        x="123.33342"
        y="338.99988"
        fill={fill === "white" ? "black" : "white"}
        fontSize="333.33px"
      >
        {value}
      </text>
    </svg>
  );
};

export const D6Svg = ({
  value,
  fill,
  numericSix,
  background,
  size,
}: DiceProps) => {
  if (value < 1 || value > 6)
    return <>Unproper value {value} for six-sided dice</>;
  switch (value) {
    case 1:
      if (numericSix) return d6square(1, fill);
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 220,170 a 50,50 0 0 1 0,100 50,50 0 0 1 0,-100 z"
          />
        </svg>
      );
    case 2:
      if (numericSix) return d6square(2, fill);
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 355.47,36.03 A 50,50 0 0 1 404,86 50,50 0 0 1 304,86 50,50 0 0 1 355.47,36.03 Z m -268,268 A 50,50 0 0 1 136,354 50,50 0 0 1 36,354 50,50 0 0 1 87.47,304.03 Z"
          />
        </svg>
      );
    case 3:
      if (numericSix) return d6square(3, fill);
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 355.47,36.03 A 50,50 0 0 1 404,86 50,50 0 0 1 304,86 50,50 0 0 1 355.47,36.03 Z M 220,170 a 50,50 0 0 1 0,100 50,50 0 0 1 0,-100 z M 87.47,304.03 A 50,50 0 0 1 136,354 50,50 0 0 1 36,354 50,50 0 0 1 87.47,304.03 Z"
          />
        </svg>
      );
    case 4:
      if (numericSix) return d6square(4, fill);
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 87.47,36.03 A 50,50 0 0 1 136,86 50,50 0 0 1 36,86 50,50 0 0 1 87.47,36.03 Z m 268,0 A 50,50 0 0 1 404,86 50,50 0 0 1 304,86 50,50 0 0 1 355.47,36.03 Z m -268,268 A 50,50 0 0 1 136,354 50,50 0 0 1 36,354 50,50 0 0 1 87.47,304.03 Z m 268,0 A 50,50 0 0 1 404,354 a 50,50 0 0 1 -100,0 50,50 0 0 1 51.47,-49.97 z"
          />
        </svg>
      );
    case 5:
      if (numericSix) return d6square(5, fill);
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 87.47,36.03 A 50,50 0 0 1 136,86 50,50 0 0 1 36,86 50,50 0 0 1 87.47,36.03 Z m 268,0 A 50,50 0 0 1 404,86 50,50 0 0 1 304,86 50,50 0 0 1 355.47,36.03 Z M 220,170 a 50,50 0 0 1 0,100 50,50 0 0 1 0,-100 z M 87.47,304.03 A 50,50 0 0 1 136,354 50,50 0 0 1 36,354 50,50 0 0 1 87.47,304.03 Z m 268,0 A 50,50 0 0 1 404,354 a 50,50 0 0 1 -100,0 50,50 0 0 1 51.47,-49.97 z"
          />
        </svg>
      );
    default:
      if (numericSix) return d6square(6, fill);
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 87.47,36.03 A 50,50 0 0 1 136,86 50,50 0 0 1 36,86 50,50 0 0 1 87.47,36.03 Z m 268,0 A 50,50 0 0 1 404,86 50,50 0 0 1 304,86 50,50 0 0 1 355.47,36.03 Z M 86,170 a 50,50 0 0 1 0,100 50,50 0 0 1 0,-100 z m 268,0 a 50,50 0 0 1 0,100 50,50 0 0 1 0,-100 z M 87.47,304.03 A 50,50 0 0 1 136,354 50,50 0 0 1 36,354 50,50 0 0 1 87.47,304.03 Z m 268,0 A 50,50 0 0 1 404,354 a 50,50 0 0 1 -100,0 50,50 0 0 1 51.47,-49.97 z"
          />
        </svg>
      );
  }
};
