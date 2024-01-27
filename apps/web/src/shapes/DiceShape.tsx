import {
  BaseBoxShapeTool,
  ShapeProps,
  T,
  TLBaseShape,
  getDefaultColorTheme,
  track,
  useEditor,
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
  const editor = useEditor();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });

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
    return <></>;
  }
}

// type DiceComponentProps = {
//   shape: IDiceShape;
//   bounds: Box2d;
// };

// export const DiceComponent = track(({ shape, bounds }: DiceComponentProps) => {
//   if (!shape) return <></>;

//   return (
//     <div
//       id={shape.id}
//       className={flexColumnStyle({})}
//       style={{
//         width: shape.props.w,
//         height: shape.props.h,
//         alignItems: "center",
//         position: "relative",
//       }}
//     >
//       <DiceIcon
//         face={shape.props.face}
//         value={shape.props.value}
//         background={shape.props.background}
//         color={shape.props.fill}
//         size={shape.props.w}
//         numericSix={shape.props.numericSix}
//       />
//       {/* {shape.props.isMax && (
//         <div
//           style={{
//             width: shape.props.w,
//             height: 1,
//             backgroundColor: "var(--color-primary)",
//             borderRadius: "50%",
//             position: "absolute",
//             bottom: -2,
//             left: 0,
//           }}
//         ></div>
//       )}
//       {shape.props.isMin && (
//         <div
//           style={{
//             width: shape.props.w,
//             height: 1,
//             backgroundColor: "var(--color-accent)",
//             borderRadius: "50%",
//             position: "absolute",
//             bottom: -2,
//             left: 0,
//           }}
//         ></div>
//       )} */}
//     </div>
//   );
// });

// export const rpgDiceShapeProps: ShapeProps<IDiceShape> = {
//   w: T.number,
//   h: T.number,
//   fill: T.string,
//   background: T.string,
//   owner: T.string,
//   face: T.number,
//   value: T.number,
//   isMin: T.boolean,
//   isMax: T.boolean,
//   numericSix: T.boolean,
// };

// export class DiceShapeUtil extends BaseBoxShapeUtil<IDiceShape> {
//   static override type = "dice" as const;
//   static override props = rpgDiceShapeProps;

//   override canResize = (_shape: IDiceShape) => false;
//   override canEditInReadOnly = () => false;
//   override canEdit: TLShapeUtilFlag<IDiceShape> = () => true;

//   getDefaultProps(): IDiceShape["props"] {
//     return {
//       w: 40,
//       h: 40,
//       fill: "var(--color-text)",
//       background: "transparent",
//       owner: "",
//       face: 6,
//       value: 6,
//       isMin: false,
//       isMax: false,
//       numericSix: false,
//     };
//   }

//   getGeometry(shape: IDiceShape) {
//     return new Rectangle2d({
//       width: shape.props.w,
//       height: shape.props.h,
//       isFilled: true,
//     });
//   }

//   component(shape: IDiceShape) {
//     const bounds = this.editor.getShapeGeometry(shape).bounds;
//     return <DiceComponent bounds={bounds} shape={shape} key={shape.id} />;
//   }

//   indicator(shape: IDiceShape) {
//     return <rect width={shape.props.w} height={shape.props.h} />;
//   }

//   override onBeforeCreate: TLOnBeforeCreateHandler<IDiceShape> = (next) => {
//     return {
//       ...next,
//       props: { ...next.props, owner: this.editor.user.getId() },
//     };
//   };
// }
