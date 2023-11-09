import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  Button,
  DefaultColorStyle,
  HTMLContainer,
  Rectangle2d,
  ShapeProps,
  ShapeUtil,
  T,
  TLBaseBoxShape,
  TLBaseShape,
  TLClickEvent,
  TLDefaultColorStyle,
  TLOnResizeHandler,
  TLShapePartial,
  TLShapeUtilFlag,
  getDefaultColorTheme,
  resizeBox,
  toDomPrecision,
  useIsEditing,
  useValue,
} from "@tldraw/tldraw";
import React, { useCallback, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { flexColumnStyle, flexRowStyle } from "../common";
import { FaMinus, FaMinusCircle, FaPlusCircle, FaTools } from "react-icons/fa";

export type IRpgClockShape = TLBaseShape<
  "rpg-clock",
  {
    w: number;
    h: number;
    color: TLDefaultColorStyle;
    parts: number;
    count: number;
  }
>;

export class RpgClockShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-clock";
  static override initial = "idle";
  override shapeType = "rpg-clock";

  override onDoubleClick: TLClickEvent = (_info) => {};
}

export const rpgClockShapeProps: ShapeProps<IRpgClockShape> = {
  w: T.number,
  h: T.number,
  color: DefaultColorStyle,
  parts: T.number,
  count: T.number,
};

export class RpgClockShapeUtil extends BaseBoxShapeUtil<IRpgClockShape> {
  static override type = "rpg-clock" as const;
  static override props = rpgClockShapeProps;

  override canResize = (_shape: IRpgClockShape) => true;
  override canEditInReadOnly = () => true;
  override canEdit: TLShapeUtilFlag<IRpgClockShape> = () => true;

  getDefaultProps(): IRpgClockShape["props"] {
    return {
      w: 300,
      h: 300,
      color: "black",
      parts: 6,
      count: 1,
    };
  }

  getGeometry(shape: IRpgClockShape) {
    return new Rectangle2d({
      width: Math.max(shape.props.w, shape.props.h),
      height: Math.max(shape.props.w, shape.props.h),
      isFilled: true,
    });
  }

  component(shape: IRpgClockShape) {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.isDarkMode,
    });

    const getData = useCallback(() => {
      const result = [];
      for (let i = 0; i < shape.props.parts; i++) {
        result.push({
          title: `p${i}`,
          value: 100 / shape.props.parts,
          color: i < shape.props.count ? theme.text : theme.solid,
        });
      }
      return result;
    }, [shape]);

    const mod = useCallback(
      (value: number) => {
        let cnt = shape.props.count + value;
        if (cnt > shape.props.parts) cnt = shape.props.parts;
        if (cnt < 0) cnt = 0;
        const shapeUpdate: TLShapePartial<IRpgClockShape> = {
          id: shape.id,
          type: "rpg-clock",
          props: {
            count: cnt,
          },
        };
        this.editor.updateShapes([shapeUpdate]);
      },
      [shape]
    );

    const isEditing = useIsEditing(shape.id);

    return (
      <div id={shape.id}>
        <PieChart
          data={getData()}
          background={theme.background}
          paddingAngle={1}
          startAngle={-90}
          onClick={(e) => console.log(e)}
        ></PieChart>

        {isEditing && (
          <>
            <Button
              type="icon"
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
              }}
              onPointerDown={() => mod(-1)}
            >
              <FaMinusCircle />
            </Button>
            <Button
              type="icon"
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
              }}
              onPointerDown={() => mod(1)}
            >
              <FaPlusCircle />
            </Button>
            <Button
              type="icon"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
              }}
            >
              <FaTools />
            </Button>
          </>
        )}
      </div>
    );
  }

  indicator(shape: IRpgClockShape) {
    return (
      <rect
        width={Math.max(shape.props.w, shape.props.h)}
        height={Math.max(shape.props.w, shape.props.h)}
      />
    );
  }

  override onResize: TLOnResizeHandler<IRpgClockShape> = (shape, info) => {
    return resizeBox(shape, info);
  };
}
