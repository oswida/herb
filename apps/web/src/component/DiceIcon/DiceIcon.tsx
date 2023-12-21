import React, { useMemo } from "react";
import { D6Svg } from "./d6";
import { track } from "@tldraw/tldraw";
import { D4Svg } from "./d4";
import { D8Svg } from "./d8";
import { D10Svg } from "./d10";
import { D12Svg } from "./d12";

interface DiceIconProps {
  face: number;
  value: number;
  size: number;
  background?: string;
  color?: string;
}

export const DiceIcon = track(
  ({ background, color, face, value, size }: DiceIconProps) => {
    const icon = useMemo(() => {
      switch (face) {
        case 6:
          return (
            <D6Svg
              value={value}
              size={size}
              fill={color ? color : "var(--color-text)"}
            />
          );
        case 4:
          return (
            <D4Svg
              value={value}
              size={size}
              fill={color ? color : "var(--color-text)"}
              background={background ? background : "var(--color-background)"}
            />
          );
        case 8:
          return (
            <D8Svg
              value={value}
              size={size}
              fill={color ? color : "var(--color-text)"}
              background={background ? background : "var(--color-background)"}
            />
          );
        case 10:
          return (
            <D10Svg
              value={value}
              size={size}
              fill={color ? color : "var(--color-text)"}
              background={background ? background : "var(--color-background)"}
            />
          );
        case 12:
          return (
            <D12Svg
              value={value}
              size={size}
              fill={color ? color : "var(--color-text)"}
              background={background ? background : "var(--color-background)"}
            />
          );
        default:
          return (
            <div>
              {face}:{value}
            </div>
          );
      }
    }, [face, value, size, color, background]);

    return (
      <div
        style={{
          backgroundColor: background,
          padding: 0,
          margin: 0,
          borderRadius: 3,
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
    );
  }
);
