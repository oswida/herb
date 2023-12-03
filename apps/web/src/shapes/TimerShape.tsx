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
  TLShapePartial,
  TLShapeUtilFlag,
  resizeBox,
  track,
  useEditor,
} from "@tldraw/tldraw";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaPauseCircle, FaPlayCircle, FaReplyAll } from "react-icons/fa";
import { flexRowStyle } from "../common";

export type ITimerShape = TLBaseShape<
  "timer",
  {
    w: number;
    h: number;
    max: number;
    value: number;
    down: boolean;
    label: string;
    color: string;
    fill: string;
    owner: string;
  }
>;

type TimerComponentProps = {
  shape: ITimerShape;
  bounds: Box2d;
};

export const TimerComponent = track(
  ({ shape, bounds }: TimerComponentProps) => {
    const editor = useEditor();
    const [ticking, setTicking] = useState(false);
    if (!shape) return <>No shape</>;

    const tick = useCallback(() => {
      if (
        (shape.props.down && shape.props.value == 0) ||
        (!shape.props.down && shape.props.value == shape.props.max)
      ) {
        setTicking(false);
        return;
      }
      let cnt = 0;

      if (shape.props.down) {
        cnt = shape.props.value - 1;
        if (cnt < 0) {
          cnt = 0;
        }
      } else {
        cnt = shape.props.value + 1;
        if (cnt > shape.props.max) {
          cnt = shape.props.max;
        }
      }
      const shapeUpdate: TLShapePartial<ITimerShape> = {
        id: shape.id,
        type: "timer",
        props: {
          value: cnt,
        },
      };
      editor.updateShapes([shapeUpdate]);
    }, [shape]);

    useEffect(() => {
      if (!ticking) return;
      setTimeout(tick, 1000);
    }, [tick, ticking]);

    const toggleTick = () => {
      if (ticking) {
        setTicking(false);
        return;
      }
      setTicking(true);
    };

    const resetTick = () => {
      if (ticking) return;
      const cnt = shape.props.down ? shape.props.max : 0;
      const shapeUpdate: TLShapePartial<ITimerShape> = {
        id: shape.id,
        type: "timer",
        props: {
          value: cnt,
        },
      };
      editor.updateShapes([shapeUpdate]);
    };

    const isOwner = useMemo(() => {
      return shape.props.owner === editor.user.getId();
    }, []);

    return (
      <div
        id={shape.id}
        style={{
          width: bounds.width,
          height: bounds.height,
          overflow: "hidden",
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: shape.props.fill,
          color: shape.props.color,
          borderRadius: "5px",
        }}
      >
        {isOwner && (
          <div
            className={flexRowStyle({ justify: "space" })}
            style={{
              gap: "3px",
              width: "100%",
            }}
          >
            <Button type="icon" onPointerDown={() => toggleTick()}>
              {!ticking && <FaPlayCircle size={16} fill={shape.props.color} />}
              {ticking && <FaPauseCircle size={16} fill={shape.props.color} />}
            </Button>
            <Button type="icon" onPointerDown={() => resetTick()}>
              <FaReplyAll
                opacity={ticking ? 0.5 : undefined}
                size={16}
                fill={shape.props.color}
              />
            </Button>
          </div>
        )}
        <div
          style={{
            display: "flex",
            width: "100%",
            flex: 0.9,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: bounds.height / 2,
              color: shape.props.color,
            }}
          >
            {shape.props.value}
          </div>
        </div>
        <div style={{ alignSelf: "center" }}>{shape.props.label}</div>
      </div>
    );
  }
);

export class TimerShapeTool extends BaseBoxShapeTool {
  static override id = "timer";
  static override initial = "idle";
  override shapeType = "timer";

  override onDoubleClick: TLClickEvent = (_info) => {};
}

export const timerShapeProps: ShapeProps<ITimerShape> = {
  w: T.number,
  h: T.number,
  max: T.number,
  value: T.number,
  down: T.boolean,
  label: T.string,
  color: T.string,
  fill: T.string,
  owner: T.string,
};

export class TimerShapeUtil extends BaseBoxShapeUtil<ITimerShape> {
  static override type = "timer" as const;
  static override props = timerShapeProps;

  override canResize = (_shape: ITimerShape) => true;
  override canEditInReadOnly = () => false;
  override canEdit: TLShapeUtilFlag<ITimerShape> = () => false;

  getDefaultProps(): ITimerShape["props"] {
    return {
      w: 140,
      h: 140,
      max: 10,
      value: 10,
      down: true,
      label: "Timer",
      color: "var(--color-text)",
      fill: "transparent",
      owner: "",
    };
  }

  getGeometry(shape: ITimerShape) {
    return new Rectangle2d({
      width: Math.max(shape.props.w, shape.props.h),
      height: Math.max(shape.props.w, shape.props.h),
      isFilled: true,
    });
  }

  component(shape: ITimerShape) {
    const bounds = this.editor.getShapeGeometry(shape).bounds;
    return <TimerComponent bounds={bounds} shape={shape} key={shape.id} />;
  }

  indicator(shape: ITimerShape) {
    return (
      <rect
        width={Math.max(shape.props.w, shape.props.h)}
        height={Math.max(shape.props.w, shape.props.h)}
      />
    );
  }

  override onResize: TLOnResizeHandler<ITimerShape> = (shape, info) => {
    return resizeBox(shape, info);
  };

  override onBeforeCreate: TLOnBeforeCreateHandler<ITimerShape> = (next) => {
    return {
      ...next,
      props: { ...next.props, owner: this.editor.user.getId() },
    };
  };
}
