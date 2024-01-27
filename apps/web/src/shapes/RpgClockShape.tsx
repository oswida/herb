import {
  BaseBoxShapeTool,
  Button,
  ShapeProps,
  T,
  TLBaseShape,
  TLShapePartial,
  getDefaultColorTheme,
  track,
  useEditor,
} from "@tldraw/tldraw";
import React, { useCallback } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { flexColumnStyle, flexRowStyle } from "../common";
import { CsField } from "../component/CustomSettings";
import { CustomShapeUtil } from "./CustomShape";

export type RpgClockShape = TLBaseShape<
  "rpg-clock",
  {
    w: number;
    h: number;
    label: string;
    owner: string;
    color: string;
    parts: number;
    _count: number;
  }
>;

export class RpgClockShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-clock";
  override shapeType = "rpg-clock";
  static override initial = "idle";
}

const shapeProps: ShapeProps<RpgClockShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  owner: T.string,
  color: T.string,
  parts: T.number,
  _count: T.number,
};

const RpgClockSettings = track(({ shape }: { shape: RpgClockShape }) => {
  return (
    <div
      className={flexColumnStyle({})}
      style={{ padding: "5px", gap: "10px" }}
    >
      <CsField shape={shape} field="color" title="Color" vtype="color" />
      <CsField shape={shape} field="label" title="Label" vtype="string" />
      <CsField
        shape={shape}
        field="parts"
        title="Number of parts"
        vtype="number"
      />
      <CsField shape={shape} field="_count" title="Value" vtype="number" />
    </div>
  );
});

const RpgClockMain = track(({ shape }: { shape: RpgClockShape }) => {
  const editor = useEditor();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });

  const getData = useCallback(() => {
    const result = [];

    for (let i = 0; i < shape.props.parts; i++) {
      result.push({
        title: `p${i}`,
        value: 100 / shape.props.parts,
        color:
          i < shape.props._count ? shape.props.color : `${shape.props.color}22`,
      });
    }
    return result;
  }, [shape]);

  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
        alignItems: "center",
      }}
    >
      {shape.props.label}
      <PieChart
        data={getData()}
        background={theme.background}
        startAngle={-90}
        segmentsShift={0.3}
        radius={48}
      ></PieChart>
    </div>
  );
});

const RpgClockActions = ({ shape }: { shape: RpgClockShape }) => {
  const editor = useEditor();

  const mod = useCallback(
    (value: number) => {
      let cnt = shape.props._count + value;
      if (cnt > shape.props.parts) cnt = shape.props.parts;
      if (cnt < 0) cnt = 0;
      const shapeUpdate: TLShapePartial<RpgClockShape> = {
        id: shape.id,
        type: "rpg-clock",
        props: {
          _count: cnt,
        },
      };
      editor.updateShapes([shapeUpdate]);
    },
    [shape]
  );

  return (
    <div
      className={flexRowStyle({ justify: "center" })}
      style={{ flexWrap: "nowrap", gap: "2px" }}
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

export class RpgClockShapeUtil extends CustomShapeUtil<RpgClockShape> {
  static override type = "rpg-clock" as const;
  static override props = shapeProps;
  override actionsCount = 3;

  override getDefaultProps(): RpgClockShape["props"] {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });
    return {
      w: 150,
      h: 150,
      label: "",
      owner: "",
      color: theme.text,
      _count: 6,
      parts: 6,
    };
  }

  override settingsComponent(shape: RpgClockShape): React.JSX.Element | null {
    return <RpgClockSettings shape={shape} />;
  }

  override mainComponent(shape: RpgClockShape): React.JSX.Element | null {
    return <RpgClockMain shape={shape} />;
  }

  override actionComponent(shape: RpgClockShape): React.JSX.Element | null {
    return <RpgClockActions shape={shape} />;
  }
}
