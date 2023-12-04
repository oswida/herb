import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  Box2d,
  Button,
  Rectangle2d,
  ShapeProps,
  T,
  TLBaseShape,
  TLClickEvent,
  TLOnBeforeCreateHandler,
  TLOnResizeHandler,
  TLShapeUtilFlag,
  resizeBox,
  toDomPrecision,
  track,
  useEditor,
  useIsEditing,
} from "@tldraw/tldraw";
import React, { useMemo } from "react";
import { flexRowStyle } from "../common";
import { FaMinusCircle, FaPlusCircle, FaUserSecret } from "react-icons/fa";

export type IRpgResourceShape = TLBaseShape<
  "rpg-resource",
  {
    w: number;
    h: number;
    max: number;
    value: number;
    label: string;
    color: string;
    fill: string;
    owner: string;
    private: boolean;
  }
>;

type RpgResComponentProps = {
  shape: IRpgResourceShape;
  bounds: Box2d;
};

export const RpgResComponent = track(
  ({ shape, bounds }: RpgResComponentProps) => {
    const editor = useEditor();
    const isEditing = useIsEditing(shape.id);
    if (!shape) return <></>;

    const isOwner = useMemo(() => {
      return shape.props.owner === editor.user.getId();
    }, []);

    const items = useMemo(() => {
      const retv: boolean[] = [];
      for (let i = 1; i <= shape.props.max; i++) {
        if (i <= shape.props.value) retv.push(true);
        else retv.push(false);
      }
      return retv;
    }, [shape, shape.props.value]);

    const boxWidth = useMemo(() => {
      let w = bounds.width - 60;
      return Math.max(w / (shape.props.max + 1), 16);
    }, [shape]);

    const mod = (value: number) => {
      let cnt = shape.props.value + value;
      if (cnt > shape.props.max) cnt = shape.props.max;
      if (cnt < 0) cnt = 0;
      editor.updateShapes([
        {
          id: shape.id,
          type: shape.type,
          props: {
            value: cnt,
          },
        },
      ]);
    };

    const canMod = useMemo(() => {
      if (!isEditing) return false;
      if (!shape.props.private) return true;
      return isOwner;
    }, [shape, isEditing, isOwner]);

    return (
      <div
        id={shape.id}
        style={{
          width: bounds.width,
          height: bounds.height,
          overflow: "hidden",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: shape.props.fill,
          color: shape.props.color,
          borderRadius: "5px",
          gap: "10px",
        }}
      >
        <div
          className={flexRowStyle({ justify: "center" })}
          style={{ width: "100%", flexWrap: "wrap" }}
        >
          {items.map((v, i) => (
            <div
              key={`res-${i}-${shape.id}`}
              style={{
                border: "solid 2px",
                borderColor: shape.props.color,
                width: boxWidth,
                height: boxWidth,
                maxHeight: boxWidth,
                maxWidth: boxWidth,
                borderRadius: "50%",
                backgroundColor: v ? shape.props.color : undefined,
              }}
            >
              {" "}
            </div>
          ))}
        </div>
        <div
          className={flexRowStyle({ justify: canMod ? "space" : "center" })}
          style={{
            width: "100%",
            alignItems: "center",
            minHeight: 42,
          }}
        >
          {canMod && (
            <Button type="icon" onPointerDown={() => mod(-1)}>
              <FaMinusCircle size={16} fill="var(--color-text)" />
            </Button>
          )}
          <div>{shape.props.label}</div>
          {canMod && (
            <Button type="icon" onPointerDown={() => mod(1)}>
              <FaPlusCircle size={16} fill="var(--color-text)" />
            </Button>
          )}
        </div>
        {shape.props.private && (
          <div
            style={{ position: "absolute", top: -15, right: -15, opacity: 0.5 }}
          >
            <FaUserSecret size={16} fill="var(--color-accent)" />
          </div>
        )}
      </div>
    );
  }
);

export class RpgResourceShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-resource";
  static override initial = "idle";
  override shapeType = "rpg-resource";

  override onDoubleClick: TLClickEvent = (_info) => {};
}

export const rpgResShapeProps: ShapeProps<IRpgResourceShape> = {
  w: T.number,
  h: T.number,
  max: T.number,
  value: T.number,
  label: T.string,
  color: T.string,
  fill: T.string,
  owner: T.string,
  private: T.boolean,
};

export class RpgResourceShapeUtil extends BaseBoxShapeUtil<IRpgResourceShape> {
  static override type = "rpg-resource" as const;
  static override props = rpgResShapeProps;

  override canResize = (_shape: IRpgResourceShape) => true;
  override canEditInReadOnly = () => false;
  override canEdit: TLShapeUtilFlag<IRpgResourceShape> = () => true;

  getDefaultProps(): IRpgResourceShape["props"] {
    return {
      w: 140,
      h: 50,
      max: 10,
      value: 10,
      label: "Resource",
      color: "var(--color-text)",
      fill: "transparent",
      owner: "",
      private: false,
    };
  }

  getGeometry(shape: IRpgResourceShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: IRpgResourceShape) {
    const bounds = this.editor.getShapeGeometry(shape).bounds;
    return <RpgResComponent bounds={bounds} shape={shape} key={shape.id} />;
  }

  indicator(shape: IRpgResourceShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override onResize: TLOnResizeHandler<IRpgResourceShape> = (shape, info) => {
    return resizeBox(shape, info);
  };

  override onBeforeCreate: TLOnBeforeCreateHandler<IRpgResourceShape> = (
    next
  ) => {
    return {
      ...next,
      props: { ...next.props, owner: this.editor.user.getId() },
    };
  };
}
