import {
  BaseBoxShapeTool,
  Button,
  ShapeProps,
  T,
  TLBaseShape,
  TLShapeId,
  TLShapePartial,
  createShapeId,
  track,
  uniqueId,
  useDefaultHelpers,
  useEditor,
} from "@tldraw/tldraw";
import { useCallback } from "react";
import { flexColumnStyle, flexRowStyle } from "../common";
import {
  CsField,
  CsFontSelect,
  CsResetColors,
} from "../component/CustomSettings";
import React from "react";
import { CustomShapeUtil } from "./CustomShape";
import { FaRandom } from "react-icons/fa";
import { GenList } from "./GenList";
import { DiceRoll, DiceRoller } from "@dice-roller/rpg-dice-roller";

export type RpgGenShape = TLBaseShape<
  "rpg-gen",
  {
    w: number;
    h: number;
    label: string;
    color: string;
    background: string;
    owner: string;
    font: string;
    items: string[];
    pairs: boolean;
    items_second: string[];
  }
>;

export class RpgGenShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-gen";
  override shapeType = "rpg-gen";
  static override initial = "idle";
}

const shapeProps: ShapeProps<RpgGenShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  color: T.string,
  background: T.string,
  owner: T.string,
  font: T.string,
  items: T.arrayOf(T.string),
  pairs: T.boolean,
  items_second: T.arrayOf(T.string),
};

const RpgGenSettings = track(({ shape }: { shape: RpgGenShape }) => {
  const editor = useEditor();
  const { addDialog } = useDefaultHelpers();
  const editList = useCallback(() => {
    if (!shape) return;
    addDialog({
      id: "rpg-gen-list",
      component: ({ onClose }) => <GenList onClose={onClose} shape={shape} />,
      onClose: () => {
        editor.setSelectedShapes([]);
      },
    });
  }, [shape]);

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
      <CsFontSelect shape={shape} title="Font" field="font" />
      <CsField shape={shape} field="pairs" title="Pairs" vtype="boolean" />
      <Button type="normal" onPointerDown={editList}>
        Edit item list
      </Button>
    </div>
  );
});

const RpgGenMain = track(({ shape }: { shape: RpgGenShape }) => {
  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
        backgroundColor: shape.props.background,
        width: shape.props.w,
        height: shape.props.h,
        minHeight: shape.props.h,
        alignItems: "center",
        padding: 7,
        borderRadius: 10,
        border: `solid 1px ${shape.props.color}`,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          fontSize: "1rem",
          textAlign: "center",
          fontFamily: `var(--tl-font-${shape.props.font})`,
        }}
      >
        {shape.props.label}
      </div>
    </div>
  );
});

const RpgGenActions = ({ shape }: { shape: RpgGenShape }) => {
  const editor = useEditor();

  const gen = () => {
    if (shape.props.items.length === 0) return;
    const roller = new DiceRoller();
    const r = roller.roll(`1d${shape.props.items.length}`) as DiceRoll;
    const item = shape.props.items[r.total - 1];
    let item2 = "";
    if (shape.props.pairs && shape.props.items_second.length > 0) {
      const r2 = roller.roll(
        `1d${shape.props.items_second.length}`
      ) as DiceRoll;
      item2 = ` ${shape.props.items_second[r2.total - 1]}`;
    }
    const sid: TLShapeId = createShapeId(uniqueId());
    const pos = {
      x: shape.x + shape.props.w + Math.random() * 40,
      y: shape.y + shape.props.h + Math.random() * 10,
    };
    editor.createShape({
      id: sid,
      type: "geo",
      x: pos.x,
      y: pos.y,
      props: {
        geo: "rectangle",
        fill: "solid",
        font: shape.props.font,
        text: `${item}${item2}`,
        align: "middle",
        size: "s",
        w: shape.props.w,
      },
    });
  };

  return (
    <div
      className={flexRowStyle({ justify: "center" })}
      style={{ flexWrap: "nowrap", gap: "2px" }}
    >
      <Button type="icon" title="Generate" onPointerDown={gen}>
        <FaRandom size={16} />
      </Button>
    </div>
  );
};

export class RpgGenShapeUtil extends CustomShapeUtil<RpgGenShape> {
  static override type = "rpg-gen" as const;
  static override props = shapeProps;
  override actionsCount = 1;

  override getDefaultProps(): RpgGenShape["props"] {
    return {
      w: 150,
      h: 150,
      label: "",
      color: "var(--color-text)",
      owner: "",
      font: "draw",
      background: "var(--color-background)",
      items: [],
      pairs: false,
      items_second: [],
    };
  }

  override settingsComponent(shape: RpgGenShape): React.JSX.Element | null {
    return <RpgGenSettings shape={shape} />;
  }

  override mainComponent(shape: RpgGenShape): React.JSX.Element | null {
    return <RpgGenMain shape={shape} />;
  }

  override actionComponent(shape: RpgGenShape): React.JSX.Element | null {
    return <RpgGenActions shape={shape} />;
  }
}
