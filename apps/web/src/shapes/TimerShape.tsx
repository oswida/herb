import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  Box2d,
  Button,
  Rectangle2d,
  ShapeProps,
  ShapeUtil,
  StateNode,
  SvgExportContext,
  T,
  TLBaseShape,
  TLClickEvent,
  TLOnBeforeUpdateHandler,
  TLOnEditEndHandler,
  TLOnHandleChangeHandler,
  TLOnResizeHandler,
  TLOnTranslateEndHandler,
  TLShapePartial,
  TLShapeUtilFlag,
  getDefaultColorTheme,
  resizeBox,
  useDialogs,
  useEditor,
  useIsEditing,
} from "@tldraw/tldraw";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { FaPlayCircle, FaTools } from "react-icons/fa";
import { TimerSettings } from "./TimerSettings";

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
  }
>;

type TimerComponentProps = {
  origin: ITimerShape;
  isEditing: boolean;
  bounds: Box2d;
};

export const TimerComponent = forwardRef<HTMLDivElement, TimerComponentProps>(
  ({ origin, isEditing, bounds }: TimerComponentProps, ref) => {
    const editor = useEditor();
    // Using local state for change propagation
    const [shape, setShape] = useState<ITimerShape>(origin);
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
      setShape({ ...shape, props: { ...shape.props, value: cnt } });
    }, [shape]);

    useEffect(() => {
      if (!ticking) return;
      setTimeout(tick, 1000);
    }, [tick, ticking]);

    const startTick = () => {
      const cnt = shape.props.down ? shape.props.max : 0;
      const shapeUpdate: TLShapePartial<ITimerShape> = {
        id: shape.id,
        type: "timer",
        props: {
          value: cnt,
        },
      };
      editor.updateShapes([shapeUpdate]);
      setShape({ ...shape, props: { ...shape.props, value: cnt } });
      setTicking(true);
    };

    const { addDialog } = useDialogs();

    return (
      <div
        id={shape.id}
        ref={ref}
        style={{
          width: bounds.width,
          height: bounds.height,
          overflow: "hidden",
          padding: "10px",
          backgroundColor: shape.props.fill,
          color: shape.props.color,
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "-1.2em",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div>{shape.props.label}</div>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: `calc(${bounds.height}px - 10px )`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: bounds.height / 1.5,
              lineHeight: bounds.height / 1.5,
            }}
            className="ticker-value"
          >
            {shape.props.value}
          </div>
        </div>
        {isEditing && (
          <>
            <Button
              type="icon"
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
              }}
              onPointerDown={() => startTick()}
            >
              <FaPlayCircle />
            </Button>
            {/* <Button
            type="icon"
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
            }}
            onPointerDown={() => mod(1)}
          >
            <FaPlusCircle />
          </Button> */}
            <Button
              type="icon"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
              }}
              onPointerDown={() => {
                addDialog({
                  component: ({ onClose }) => (
                    <TimerSettings onClose={onClose} shape={shape} />
                  ),
                  onClose: () => {
                    void null;
                  },
                });
              }}
            >
              <FaTools />
            </Button>
          </>
        )}
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
};

export class TimerShapeUtil extends BaseBoxShapeUtil<ITimerShape> {
  static override type = "timer" as const;
  static override props = timerShapeProps;

  override canResize = (_shape: ITimerShape) => true;
  override canEditInReadOnly = () => true;
  override canEdit: TLShapeUtilFlag<ITimerShape> = () => true;

  componentRef = React.createRef<HTMLDivElement>();

  getDefaultProps(): ITimerShape["props"] {
    return {
      w: 100,
      h: 100,
      max: 10,
      value: 10,
      down: true,
      label: "Timer",
      color: "var(--color-text)",
      fill: "transparent",
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
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });
    const isEditing = useIsEditing(shape.id);
    const bounds = this.editor.getShapeGeometry(shape).bounds;

    return (
      <TimerComponent
        ref={this.componentRef}
        bounds={bounds}
        isEditing={isEditing}
        origin={shape}
        key={shape.id}
      />
    );
  }

  indicator(shape: ITimerShape) {
    return (
      <rect
        width={Math.max(shape.props.w, shape.props.h)}
        height={Math.max(shape.props.w, shape.props.h)}
      />
    );
  }

  updateProps(shape: ITimerShape, remote: boolean) {
    if (!this.componentRef.current) return;
    this.componentRef.current.style.backgroundColor = shape.props.fill;
    this.componentRef.current.style.color = shape.props.color;
    if (!remote) return;
    const value =
      this.componentRef.current.getElementsByClassName("ticker-value");
    if (value.length == 0) return;
    value[0].innerHTML = shape.props.value.toString();
  }

  override onResize: TLOnResizeHandler<ITimerShape> = (shape, info) => {
    return resizeBox(shape, info);
  };

  override onEditEnd: TLOnEditEndHandler<ITimerShape> = (shape) => {
    this.updateProps(shape, false);
  };
}
