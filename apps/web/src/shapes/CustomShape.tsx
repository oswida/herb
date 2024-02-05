import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  Editor,
  Rectangle2d,
  ShapeProps,
  T,
  TLBaseShape,
  TLOnBeforeCreateHandler,
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
    owner: string;
    actionsUp?: boolean;
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
  actions: (shape: any) => React.JSX.Element | null;
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
        {shape.props.actionsUp && (
          <div style={{ visibility: !isSelected ? "hidden" : undefined }}>
            {actions(shape)}
          </div>
        )}
        {children}
        {isSelected && !shape.props.actionsUp && actions(shape)}
      </div>
    );
  }
);

const shapeProps: ShapeProps<ICustomShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  owner: T.string,
  actionsUp: T.boolean,
};

export abstract class CustomShapeUtil<
  T extends TLBaseShape<any, any>
> extends BaseBoxShapeUtil<T> {
  // static override type = "custom" as const; // override
  // static override props = shapeProps; // override
  actionsHeight = 40;
  actionsWidth = 25;
  actionsCount = 1; // override if needed

  override canResize = (_shape: T) => true; // override if needed
  override canEditInReadOnly = () => false;
  override canEdit: TLShapeUtilFlag<T> = () => true; // override if needed
  override canBind = () => true;
  override canSnap: TLShapeUtilFlag<T> = () => true;

  // override
  getDefaultProps(): T["props"] {
    return {
      w: 150,
      h: 150,
      label: "",
      owner: "",
    };
  }

  abstract mainComponent(shape: T): React.JSX.Element | null;
  abstract actionComponent(shape: T): React.JSX.Element | null;
  abstract settingsComponent(shape: T): React.JSX.Element | null;

  getGeometry(shape: T) {
    const hasActions = this.actionComponent(shape) !== null;
    return new Rectangle2d({
      width: shape.props.w,
      height: hasActions ? shape.props.h + this.actionsHeight : shape.props.h,
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
    const hasActions = this.actionComponent(shape) !== null;
    return (
      <rect
        width={shape.props.w}
        height={hasActions ? shape.props.h + this.actionsHeight : shape.props.h}
      />
    );
  }

  override onResize = (shape: T, info: TLResizeInfo<T>) => {
    if (
      info.scaleX * info.initialBounds.w <=
      this.actionsCount * this.actionsWidth
    )
      return;
    return resizeBox(shape, info);
  };

  // override onBeforeCreate: TLOnBeforeCreateHandler<T> = (next) => {
  //   if (!Object.hasOwn(next, "owner")) return next;
  //   return {
  //     ...next,
  //     props: { ...next.props, owner: this.editor.user.getId() },
  //   };
  // };
}
