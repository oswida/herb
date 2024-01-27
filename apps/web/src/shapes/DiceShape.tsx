import {
  BaseBoxShapeTool,
  ShapeProps,
  T,
  TLBaseShape,
  getDefaultColorTheme,
  track,
} from "@tldraw/tldraw";
import React from "react";

import { flexColumnStyle } from "../common";
import { DiceIcon } from "../component/DiceIcon";
import { CustomShapeUtil } from "./CustomShape";

export type RpgDiceShape = TLBaseShape<
  "rpg-dice",
  {
    w: number;
    h: number;
    label: string;
    _color: string;
    _background: string;
    _face: number;
    _value: number;
    _isMin: boolean;
    _isMax: boolean;
    _numericSix: boolean;
  }
>;

export class RpgDiceShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-dice";
  override shapeType = "rpg-dice";
  static override initial = "idle";
}

const shapeProps: ShapeProps<RpgDiceShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  _color: T.string,
  _face: T.number,
  _value: T.number,
  _isMin: T.boolean,
  _isMax: T.boolean,
  _numericSix: T.boolean,
  _background: T.string,
};

const RpgDiceMain = track(({ shape }: { shape: RpgDiceShape }) => {
  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props._color,
        alignItems: "center",
      }}
    >
      <DiceIcon
        face={shape.props._face}
        value={shape.props._value}
        background={shape.props._background}
        color={shape.props._color}
        size={shape.props.w}
        numericSix={shape.props._numericSix}
      />
    </div>
  );
});

export class RpgDiceShapeUtil extends CustomShapeUtil<RpgDiceShape> {
  static override type = "rpg-dice" as const;
  static override props = shapeProps;
  override actionsCount = 3;
  override canResize = (_shape: RpgDiceShape) => false;

  override getDefaultProps(): RpgDiceShape["props"] {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });
    return {
      w: 40,
      h: 40,
      label: "",
      _color: theme.text,
      _face: 6,
      _isMax: false,
      _isMin: false,
      _numericSix: true,
      _value: 1,
      _background: theme.background,
    };
  }

  override settingsComponent(shape: RpgDiceShape): React.JSX.Element | null {
    return null;
  }

  override mainComponent(shape: RpgDiceShape): React.JSX.Element | null {
    return <RpgDiceMain shape={shape} />;
  }

  override actionComponent(shape: RpgDiceShape): React.JSX.Element | null {
    return null;
  }
}
