import {
  BaseBoxShapeUtil,
  Box2d,
  Rectangle2d,
  ShapeProps,
  T,
  TLBaseShape,
  TLOnBeforeCreateHandler,
  TLShapeUtilFlag,
  track,
} from "@tldraw/tldraw";
import React from "react";

import { flexColumnStyle } from "../common";
import { DiceIcon } from "../component/DiceIcon";

export type IDiceShape = TLBaseShape<
  "dice",
  {
    w: number;
    h: number;
    fill: string;
    background: string;
    owner: string;
    face: number;
    value: number;
    isMin: boolean;
    isMax: boolean;
  }
>;

type DiceComponentProps = {
  shape: IDiceShape;
  bounds: Box2d;
};

export const DiceComponent = track(({ shape, bounds }: DiceComponentProps) => {
  if (!shape) return <></>;

  return (
    <div
      id={shape.id}
      className={flexColumnStyle({})}
      style={{
        width: shape.props.w,
        height: shape.props.h,
        alignItems: "center",
        position: "relative",
      }}
    >
      <DiceIcon
        face={shape.props.face}
        value={shape.props.value}
        background={shape.props.background}
        color={shape.props.fill}
        size={shape.props.w}
      />
      {/* {shape.props.isMax && (
        <div
          style={{
            width: shape.props.w,
            height: 1,
            backgroundColor: "var(--color-primary)",
            borderRadius: "50%",
            position: "absolute",
            bottom: -2,
            left: 0,
          }}
        ></div>
      )}
      {shape.props.isMin && (
        <div
          style={{
            width: shape.props.w,
            height: 1,
            backgroundColor: "var(--color-accent)",
            borderRadius: "50%",
            position: "absolute",
            bottom: -2,
            left: 0,
          }}
        ></div>
      )} */}
    </div>
  );
});

export const rpgDiceShapeProps: ShapeProps<IDiceShape> = {
  w: T.number,
  h: T.number,
  fill: T.string,
  background: T.string,
  owner: T.string,
  face: T.number,
  value: T.number,
  isMin: T.boolean,
  isMax: T.boolean,
};

export class DiceShapeUtil extends BaseBoxShapeUtil<IDiceShape> {
  static override type = "dice" as const;
  static override props = rpgDiceShapeProps;

  override canResize = (_shape: IDiceShape) => false;
  override canEditInReadOnly = () => false;
  override canEdit: TLShapeUtilFlag<IDiceShape> = () => true;

  getDefaultProps(): IDiceShape["props"] {
    return {
      w: 40,
      h: 40,
      fill: "var(--color-text)",
      background: "transparent",
      owner: "",
      face: 6,
      value: 6,
      isMin: false,
      isMax: false,
    };
  }

  getGeometry(shape: IDiceShape) {
    return new Rectangle2d({
      width: Math.max(shape.props.w, shape.props.h),
      height: Math.max(shape.props.w, shape.props.h),
      isFilled: true,
    });
  }

  component(shape: IDiceShape) {
    const bounds = this.editor.getShapeGeometry(shape).bounds;
    return <DiceComponent bounds={bounds} shape={shape} key={shape.id} />;
  }

  indicator(shape: IDiceShape) {
    return (
      <rect
        width={Math.max(shape.props.w, shape.props.h)}
        height={Math.max(shape.props.w, shape.props.h)}
      />
    );
  }

  override onBeforeCreate: TLOnBeforeCreateHandler<IDiceShape> = (next) => {
    return {
      ...next,
      props: { ...next.props, owner: this.editor.user.getId() },
    };
  };
}
