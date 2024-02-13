import {
  BaseBoxShapeTool,
  Button,
  ShapeProps,
  T,
  TLBaseShape,
  track,
  useEditor,
} from "@tldraw/tldraw";
import React, { useCallback, useMemo } from "react";
import { flexColumnStyle, flexRowStyle } from "../common";
import {
  FaCircle,
  FaHeart,
  FaMinusCircle,
  FaPlusCircle,
  FaRegCircle,
  FaRegHeart,
  FaRegSquare,
  FaRegStar,
  FaSquare,
  FaStar,
} from "react-icons/fa";
import {
  CsField,
  CsIconSelect,
  CsResetColors,
} from "../component/CustomSettings";
import { CustomShapeUtil } from "./CustomShape";
import {
  BsDroplet,
  BsDropletFill,
  BsSquare,
  BsTriangle,
  BsTriangleFill,
  BsXSquare,
} from "react-icons/bs";
import { BiLeaf, BiSolidLeaf } from "react-icons/bi";

export type RpgResourceShape = TLBaseShape<
  "rpg-resource",
  {
    w: number;
    h: number;
    label: string;
    owner: string;
    color: string;
    background: string;
    style: string;
    max: number;
    _value: number;
  }
>;

export class RpgResourceShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-resource";
  override shapeType = "rpg-resource";
  static override initial = "idle";
}

const shapeProps: ShapeProps<RpgResourceShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  owner: T.string,
  color: T.string,
  background: T.string,
  _value: T.number,
  max: T.number,
  style: T.string,
};

const RpgResourceSettings = track(({ shape }: { shape: RpgResourceShape }) => {
  return (
    <div
      className={flexColumnStyle({})}
      style={{ padding: "5px", gap: "10px" }}
    >
      <CsField shape={shape} field="color" title="Color" vtype="color" />
      <CsField
        shape={shape}
        field="background"
        title="Background"
        vtype="color"
      />
      <CsResetColors shape={shape} />
      <CsField shape={shape} field="label" title="Label" vtype="string" />
      <CsField shape={shape} field="max" title="Maximum value" vtype="number" />
      <CsIconSelect
        shape={shape}
        field="style"
        title="Shape"
        dict={{
          square: <FaSquare size={16} />,
          circle: <FaCircle size={16} />,
          triangle: <BsTriangleFill size={16} />,
          star: <FaStar size={16} />,
          heart: <FaHeart size={16} />,
          droplet: <BsDropletFill size={16} />,
          leaf: <BiSolidLeaf size={16} />,
          cross: <BsXSquare size={16} />,
        }}
      />
      <CsField shape={shape} field="_value" title="Value" vtype="number" />
    </div>
  );
});

const RpgResourceMain = track(({ shape }: { shape: RpgResourceShape }) => {
  const editor = useEditor();

  const isSelected = useMemo(() => {
    return shape.id === editor.getOnlySelectedShape()?.id;
  }, [editor, shape, editor.getOnlySelectedShape()]);

  const items = useMemo(() => {
    const retv: boolean[] = [];
    for (let i = 1; i <= shape.props.max; i++) {
      if (i <= shape.props._value) retv.push(true);
      else retv.push(false);
    }
    return retv;
  }, [shape, shape.props._value]);

  const boxWidth = useMemo(() => {
    let w = shape.props.w - 80;
    return Math.max((w - 4 * (shape.props.max - 1)) / shape.props.max, 16);
  }, [shape.props.w]);

  const dotShape = useCallback(
    (v: boolean) => {
      switch (shape.props.style) {
        case "heart":
          return v ? (
            <FaHeart fill={shape.props.color} size={boxWidth} />
          ) : (
            <FaRegHeart fill={shape.props.color} size={boxWidth} />
          );
        case "star":
          return v ? (
            <FaStar fill={shape.props.color} size={boxWidth} />
          ) : (
            <FaRegStar fill={shape.props.color} size={boxWidth} />
          );
        case "circle":
          return v ? (
            <FaCircle fill={shape.props.color} size={boxWidth} />
          ) : (
            <FaRegCircle fill={shape.props.color} size={boxWidth} />
          );
        case "triangle":
          return v ? (
            <BsTriangleFill fill={shape.props.color} size={boxWidth} />
          ) : (
            <BsTriangle fill={shape.props.color} size={boxWidth} />
          );
        case "droplet":
          return v ? (
            <BsDropletFill fill={shape.props.color} size={boxWidth} />
          ) : (
            <BsDroplet fill={shape.props.color} size={boxWidth} />
          );
        case "leaf":
          return v ? (
            <BiSolidLeaf fill={shape.props.color} size={boxWidth} />
          ) : (
            <BiLeaf fill={shape.props.color} size={boxWidth} />
          );
        case "cross":
          return v ? (
            <BsXSquare fill={shape.props.color} size={boxWidth} />
          ) : (
            <BsSquare fill={shape.props.color} size={boxWidth} />
          );
        default:
          return v ? (
            <FaSquare fill={shape.props.color} size={boxWidth} />
          ) : (
            <FaRegSquare fill={shape.props.color} size={boxWidth} />
          );
      }
    },
    [shape.props.style, boxWidth, shape.props.color]
  );

  const mod = (value: number) => {
    let cnt = shape.props._value + value;
    if (cnt > shape.props.max) cnt = shape.props.max;
    if (cnt < 0) cnt = 0;
    editor.updateShapes([
      {
        id: shape.id,
        type: shape.type,
        props: {
          _value: cnt,
        },
      },
    ]);
  };

  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
        background: shape.props.background,
        alignItems: "center",
        width: shape.props.w,
        height: shape.props.h,
        borderRadius: 10,
      }}
      title={`${shape.props._value}/${shape.props.max}`}
    >
      <div
        className={flexRowStyle({ justify: "center" })}
        style={{ width: "100%", flexWrap: "nowrap", gap: 4 }}
      >
        <Button
          type="icon"
          onPointerDown={() => mod(-1)}
          style={{ visibility: !isSelected ? "hidden" : undefined }}
        >
          <FaMinusCircle size={16} fill={shape.props.color} />
        </Button>
        {items.map((v, i) => (
          <div key={`res-${i}-${shape.id}`}>{dotShape(v)}</div>
        ))}
        <Button
          type="icon"
          onPointerDown={() => mod(1)}
          style={{ visibility: !isSelected ? "hidden" : undefined }}
        >
          <FaPlusCircle size={16} fill={shape.props.color} />
        </Button>
      </div>
    </div>
  );
});

export class RpgResourceShapeUtil extends CustomShapeUtil<RpgResourceShape> {
  static override type = "rpg-resource" as const;
  static override props = shapeProps;
  override actionsCount = 0;

  override getDefaultProps(): RpgResourceShape["props"] {
    return {
      w: 200,
      h: 50,
      label: "",
      owner: "",
      color: "var(--color-text)",
      background: "var(--color-background)",
      _value: 0,
      max: 5,
      style: "square",
    };
  }

  override settingsComponent(
    shape: RpgResourceShape
  ): React.JSX.Element | null {
    return <RpgResourceSettings shape={shape} />;
  }

  override mainComponent(shape: RpgResourceShape): React.JSX.Element | null {
    return <RpgResourceMain shape={shape} />;
  }

  override actionComponent(shape: RpgResourceShape): React.JSX.Element | null {
    return null;
  }
}
