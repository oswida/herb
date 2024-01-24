import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  Rectangle2d,
  ShapeProps,
  T,
  TLBaseShape,
  TLHandle,
  TLOnClickHandler,
  TLOnHandleChangeHandler,
  TLResizeInfo,
  TLShapeUtilFlag,
  resizeBox,
  track,
  useUiEvents,
} from "@tldraw/tldraw";
import React, { ComponentProps } from "react";
import { customSettingsVisible, flexColumnStyle } from "../common";
import { useSetAtom } from "jotai";

export type ICustomShape = TLBaseShape<
  "custom", // override, give common prefix
  {
    w: number;
    h: number;
    label: string;
    // TODO: your props
  }
>;

export class CustomShapeTool extends BaseBoxShapeTool {
  static override id = "custom"; // override
  override shapeType = "custom"; // override
  static override initial = "idle";
}

type BaseCustomProps = {
  shape: TLBaseShape<any, any>;
} & ComponentProps<"div">;

export const BaseCustomMain = track(
  ({ shape, children, ...rest }: BaseCustomProps) => {
    const setVisible = useSetAtom(customSettingsVisible);

    const select = () => {
      console.log("click");
      setVisible(true);
    };

    return (
      <div
        className={flexColumnStyle({})}
        style={{
          backgroundColor: "red",
          width: shape.props.w,
          height: shape.props.h,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export const shapeProps: ShapeProps<ICustomShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
};

export abstract class CustomShapeUtil<
  T extends TLBaseShape<any, any>
> extends BaseBoxShapeUtil<T> {
  // static override type = "custom" as const; // override
  // static override props = shapeProps; // override

  override canResize = (_shape: T) => true; // override if needed
  override canEditInReadOnly = () => false;
  override canEdit: TLShapeUtilFlag<T> = () => true; // override if needed

  // override
  getDefaultProps(): T["props"] {
    return {
      w: 150,
      h: 150,
      label: "",
    };
  }

  abstract mainComponent(shape: T): React.JSX.Element;
  abstract actionComponent(shape: T): React.JSX.Element;
  abstract settingsComponent(shape: T): React.JSX.Element;

  getGeometry(shape: T) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: T) {
    if (!shape) return null;
    return (
      <BaseCustomMain shape={shape}>
        {this.mainComponent(shape)}
        {this.actionComponent(shape)}
      </BaseCustomMain>
    );
  }

  indicator(shape: T) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override onResize = (shape: T, info: TLResizeInfo<T>) => {
    return resizeBox(shape, info);
  };
}
