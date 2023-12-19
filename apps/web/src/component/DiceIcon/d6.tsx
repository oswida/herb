import React from "react";
import { DiceProps } from "./props";

export const D6Svg = ({ value, size, fill }: DiceProps) => {
  if (value < 1 || value > 6)
    return <>Unproper value {value} for six-sided dice</>;
  switch (value) {
    case 1:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 220,170 a 50,50 0 0 1 0,100 50,50 0 0 1 0,-100 z"
          />
        </svg>
      );
    case 2:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 355.47,36.03 A 50,50 0 0 1 404,86 50,50 0 0 1 304,86 50,50 0 0 1 355.47,36.03 Z m -268,268 A 50,50 0 0 1 136,354 50,50 0 0 1 36,354 50,50 0 0 1 87.47,304.03 Z"
          />
        </svg>
      );
    case 3:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 355.47,36.03 A 50,50 0 0 1 404,86 50,50 0 0 1 304,86 50,50 0 0 1 355.47,36.03 Z M 220,170 a 50,50 0 0 1 0,100 50,50 0 0 1 0,-100 z M 87.47,304.03 A 50,50 0 0 1 136,354 50,50 0 0 1 36,354 50,50 0 0 1 87.47,304.03 Z"
          />
        </svg>
      );
    case 4:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 87.47,36.03 A 50,50 0 0 1 136,86 50,50 0 0 1 36,86 50,50 0 0 1 87.47,36.03 Z m 268,0 A 50,50 0 0 1 404,86 50,50 0 0 1 304,86 50,50 0 0 1 355.47,36.03 Z m -268,268 A 50,50 0 0 1 136,354 50,50 0 0 1 36,354 50,50 0 0 1 87.47,304.03 Z m 268,0 A 50,50 0 0 1 404,354 a 50,50 0 0 1 -100,0 50,50 0 0 1 51.47,-49.97 z"
          />
        </svg>
      );
    case 5:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
          <path
            fill={fill}
            d="M 38.5,0 A 38.5,38.5 0 0 0 0,38.5 v 363 A 38.5,38.5 0 0 0 38.5,440 h 363 A 38.5,38.5 0 0 0 440,401.5 V 38.5 A 38.5,38.5 0 0 0 401.5,0 Z M 87.47,36.03 A 50,50 0 0 1 136,86 50,50 0 0 1 36,86 50,50 0 0 1 87.47,36.03 Z m 268,0 A 50,50 0 0 1 404,86 50,50 0 0 1 304,86 50,50 0 0 1 355.47,36.03 Z M 220,170 a 50,50 0 0 1 0,100 50,50 0 0 1 0,-100 z M 87.47,304.03 A 50,50 0 0 1 136,354 50,50 0 0 1 36,354 50,50 0 0 1 87.47,304.03 Z m 268,0 A 50,50 0 0 1 404,354 a 50,50 0 0 1 -100,0 50,50 0 0 1 51.47,-49.97 z"
          />
        </svg>
      );
    default:
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
