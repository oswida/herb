import {
  BaseBoxShapeTool,
  Button,
  ShapeProps,
  T,
  TLBaseShape,
  getDefaultColorTheme,
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
import { CsField, CsIconSelect } from "../component/CustomSettings";
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
    color: string;
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
  color: T.string,
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
    </div>
  );
});

const RpgResourceMain = track(({ shape }: { shape: RpgResourceShape }) => {
  const items = useMemo(() => {
    const retv: boolean[] = [];
    for (let i = 1; i <= shape.props.max; i++) {
      if (i <= shape.props._value) retv.push(true);
      else retv.push(false);
    }
    return retv;
  }, [shape, shape.props._value]);

  const boxWidth = useMemo(() => {
    let w = shape.props.w;
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

  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
        alignItems: "center",
      }}
    >
      <div
        className={flexRowStyle({ justify: "center" })}
        style={{ width: "100%", flexWrap: "nowrap", gap: 4 }}
      >
        {items.map((v, i) => (
          <div key={`res-${i}-${shape.id}`}>{dotShape(v)}</div>
        ))}
      </div>
      {shape.props.label}
    </div>
  );
});

const RpgResourceActions = ({ shape }: { shape: RpgResourceShape }) => {
  const editor = useEditor();

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
      className={flexRowStyle({ justify: "space" })}
      style={{ flexWrap: "nowrap", gap: "10px", flex: 1 }}
    >
      <Button
        type="icon"
        title="Decrease"
        onPointerDown={() => mod(-1)}
        style={{ minHeight: "16px", minWidth: "16px" }}
      >
        <FaMinusCircle size={16} />
      </Button>
      <Button
        type="icon"
        title="Increase"
        onPointerDown={() => mod(1)}
        style={{ minHeight: "16px", minWidth: "16px" }}
      >
        <FaPlusCircle size={16} />
      </Button>
    </div>
  );
};

export class RpgResourceShapeUtil extends CustomShapeUtil<RpgResourceShape> {
  static override type = "rpg-resource" as const;
  static override props = shapeProps;
  override actionsCount = 3;

  override getDefaultProps(): RpgResourceShape["props"] {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });
    return {
      w: 150,
      h: 150,
      label: "",
      color: theme.text,
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
    return <RpgResourceActions shape={shape} />;
  }
}
