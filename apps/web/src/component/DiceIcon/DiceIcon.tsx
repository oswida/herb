import React, { useMemo } from "react";
import { D6Svg } from "./d6";
import { track } from "@tldraw/tldraw";

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
          ); // (value, size, color ? color : "var(--color-text)");
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
        }}
      >
        {icon}
      </div>
    );
  }
);
