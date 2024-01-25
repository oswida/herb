import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  Editor,
  Rectangle2d,
  ShapeProps,
  T,
  TLBaseShape,
  TLResizeInfo,
  TLShapeUtilFlag,
  resizeBox,
  track,
} from "@tldraw/tldraw";
import React, { ComponentProps, useMemo } from "react";
import { flexColumnStyle } from "../common";

export type ICustomShape = TLBaseShape<
  "custom", // override, give common prefix
  {
    w: number;
    h: number;
    label: string;
    // your props
  }
>;

export class CustomShapeTool extends BaseBoxShapeTool {
  static override id = "custom"; // override
  override shapeType = "custom"; // override
  static override initial = "idle";
}

type BaseCustomProps = {
  shape: TLBaseShape<any, any>;
  actions: (shape: any) => React.JSX.Element;
  editor: Editor;
} & ComponentProps<"div">;

export const BaseCustomMain = track(
  ({ shape, children, actions, editor, ...rest }: BaseCustomProps) => {
    const isSelected = useMemo(() => {
      return shape.id === editor.getOnlySelectedShape()?.id;
    }, [editor, shape, editor.getOnlySelectedShape()]);

    return (
      <div
        className={flexColumnStyle({})}
        style={{
          width: shape.props.w,
          height: shape.props.h,
          alignItems: "center",
          justifyContent: "start",
        }}
        {...rest}
      >
        {children}
        {isSelected && actions(shape)}
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
  actionsHeight = 40;
  actionsCount = 1; // override if needed

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
      height: shape.props.h + this.actionsHeight,
      isFilled: true,
    });
  }

  component(shape: T) {
    if (!shape) return null;
    return (
      <BaseCustomMain
        shape={shape}
        editor={this.editor}
        actions={this.actionComponent}
      >
        {this.mainComponent(shape)}
      </BaseCustomMain>
    );
  }

  indicator(shape: T) {
    return (
      <rect width={shape.props.w} height={shape.props.h + this.actionsHeight} />
    );
  }

  override onResize = (shape: T, info: TLResizeInfo<T>) => {
    if (
      info.scaleX * info.initialBounds.w <=
      this.actionsCount * this.actionsHeight
    )
      return;
    return resizeBox(shape, info);
  };
}
