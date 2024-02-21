import {
  BaseBoxShapeTool,
  ShapeProps,
  T,
  TLBaseShape,
  TLShapeId,
  TLShapePartial,
  TldrawUiButton,
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
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";

export type RpgGenShape = TLBaseShape<
  "rpg-gen",
  {
    w: number;
    h: number;
    label: string;
    color: string;
    backgroundUrl: string;
    owner: string;
    font: string;
    items: string[][];
    separator: string;
    count: number;
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
  backgroundUrl: T.string,
  owner: T.string,
  font: T.string,
  separator: T.string,
  items: T.arrayOf(T.arrayOf(T.string)),
  count: T.number,
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
      <CsResetColors shape={shape} />
      <CsField shape={shape} field="label" title="Label" vtype="string" />
      <CsFontSelect shape={shape} title="Font" field="font" />
      <CsField
        shape={shape}
        field="separator"
        title="Item separator - \n for newline"
        vtype="string"
      />
      <TldrawUiButton type="normal" onPointerDown={editList}>
        Edit item list
      </TldrawUiButton>
    </div>
  );
});

const RpgGenMain = track(({ shape }: { shape: RpgGenShape }) => {
  const editor = useEditor();
  const mod = useCallback(
    (val: number) => {
      let v = shape.props.count + val;
      if (v < 1) v = 1;
      const shapeUpdate: TLShapePartial<any> = {
        id: shape.id,
        type: shape.type,
        props: {
          count: v,
        },
      };
      editor.updateShapes([shapeUpdate]);
    },
    [shape]
  );

  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
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
      <div className={flexRowStyle({})}>
        <TldrawUiButton type="icon" onPointerDown={() => mod(-1)}>
          <BiMinusCircle fill={shape.props.color} size={16} />
        </TldrawUiButton>
        <div
          style={{
            fontFamily: `var(--tl-font-${shape.props.font})`,
            fontSize: "1rem",
          }}
        >
          {shape.props.count}
        </div>
        <TldrawUiButton type="icon" onPointerDown={() => mod(1)}>
          <BiPlusCircle fill={shape.props.color} size={16} />
        </TldrawUiButton>
      </div>
    </div>
  );
});

const RpgGenActions = ({ shape }: { shape: RpgGenShape }) => {
  const editor = useEditor();
  const gen = () => {
    if (shape.props.items.length === 0) return;
    const roller = new DiceRoller();

    for (let i = 0; i < shape.props.count; i++) {
      const result: string[] = [];
      for (let c = 0; c < shape.props.items.length; c++) {
        const category = shape.props.items[c];
        const r = roller.roll(`1d${category.length}`) as DiceRoll;
        const item = category[r.total - 1];
        result.push(item);
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
          font: shape.props.font,
          text: result.join(
            shape.props.separator === "\\n" ? "\n" : shape.props.separator
          ),
          align: "middle",
          verticalAlign: "middle",
          size: "s",
          w: shape.props.w,
        },
      });
    }
  };

  return (
    <div
      className={flexRowStyle({ justify: "center" })}
      style={{ flexWrap: "nowrap", gap: "2px" }}
    >
      <TldrawUiButton type="icon" title="Generate" onPointerDown={gen}>
        <FaRandom size={16} />
      </TldrawUiButton>
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
      backgroundUrl: "",
      items: [],
      separator: " ",
      count: 1,
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
