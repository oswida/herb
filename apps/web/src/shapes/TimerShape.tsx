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
import {
  FaPauseCircle,
  FaPlayCircle,
  FaReplyAll,
  FaStopCircle,
  FaTools,
} from "react-icons/fa";
import { TimerSettings } from "./TimerSettings";
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
  }
>;

type TimerComponentProps = {
  origin: ITimerShape;
  bounds: Box2d;
  updateProps: (shape: ITimerShape, remote: boolean) => void;
  getMaxValue: (shape: ITimerShape) => number;
};

export const TimerComponent = forwardRef<HTMLDivElement, TimerComponentProps>(
  ({ origin, bounds, updateProps, getMaxValue }: TimerComponentProps, ref) => {
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
      let maxVal = getMaxValue(shape);

      if (shape.props.down) {
        cnt = shape.props.value - 1;
        if (cnt < 0) {
          cnt = 0;
        }
      } else {
        cnt = shape.props.value + 1;
        if (cnt > maxVal) {
          cnt = maxVal;
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

    const toggleTick = () => {
      if (ticking) {
        setTicking(false);
        return;
      }
      setTicking(true);
    };

    const resetTick = () => {
      if (ticking) return;
      const cnt = shape.props.down ? getMaxValue(shape) : 0;
      const shapeUpdate: TLShapePartial<ITimerShape> = {
        id: shape.id,
        type: "timer",
        props: {
          value: cnt,
        },
      };
      editor.updateShapes([shapeUpdate]);
      setShape({ ...shape, props: { ...shape.props, value: cnt } });
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
          paddingBottom: "20px",
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
            height: `calc(${bounds.height}px - 50px )`,
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

        <div
          className={flexRowStyle({ justify: "space" })}
          style={{
            gap: "5px",
            width: "100%",
          }}
        >
          <Button type="icon" onPointerDown={() => toggleTick()}>
            {!ticking && (
              <FaPlayCircle
                className="ticker-buttons"
                size={16}
                fill={shape.props.color}
              />
            )}
            {ticking && (
              <FaPauseCircle
                className="ticker-buttons"
                size={16}
                fill={shape.props.color}
              />
            )}
          </Button>
          <Button type="icon" onPointerDown={() => resetTick()}>
            <FaReplyAll
              opacity={ticking ? 0.5 : undefined}
              className="ticker-buttons"
              size={16}
              fill={shape.props.color}
            />
          </Button>
          <Button
            type="icon"
            onPointerDown={() => {
              if (ticking) return;
              addDialog({
                component: ({ onClose }) => (
                  <TimerSettings
                    onClose={onClose}
                    shape={shape}
                    updateProps={updateProps}
                    getMaxValue={getMaxValue}
                  />
                ),
                onClose: () => {
                  void null;
                },
              });
            }}
          >
            <FaTools
              className="ticker-buttons"
              size={16}
              fill={shape.props.color}
              opacity={ticking ? 0.5 : undefined}
            />
          </Button>
        </div>
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
  override canEdit: TLShapeUtilFlag<ITimerShape> = () => false;

  componentRef = React.createRef<HTMLDivElement>();

  getDefaultProps(): ITimerShape["props"] {
    return {
      w: 150,
      h: 150,
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
        origin={shape}
        updateProps={(shape: ITimerShape, remote: boolean) =>
          this.updateProps(shape, remote)
        }
        getMaxValue={(shape) => this.getMaxValue(shape)}
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
    const buttons =
      this.componentRef.current.getElementsByClassName("ticker-buttons");
    for (let i = 0; i < buttons.length; i++) {
      buttons.item(i)?.setAttribute("fill", shape.props.color);
    }
    this.componentRef.current.setAttribute(
      "data-max",
      shape.props.max.toString()
    );

    if (!remote) return;
    const value =
      this.componentRef.current.getElementsByClassName("ticker-value");
    if (value.length == 0) return;
    value[0].innerHTML = shape.props.value.toString();
  }

  override onResize: TLOnResizeHandler<ITimerShape> = (shape, info) => {
    if (info.scaleX < 1.0 || info.scaleY < 1.0) {
      return;
    }
    return resizeBox(shape, info);
  };

  override onEditEnd: TLOnEditEndHandler<ITimerShape> = (shape) => {
    this.updateProps(shape, false);
  };

  getMaxValue(shape: ITimerShape) {
    if (!this.componentRef.current) return shape.props.max;
    const ma = this.componentRef.current.getAttribute("data-max");
    if (!ma) return shape.props.max;
    const num = Number.parseInt(ma);
    if (Number.isNaN(num)) return shape.props.max;
    return num;
  }
}
