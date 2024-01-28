import {
  BaseBoxShapeTool,
  Button,
  ShapeProps,
  T,
  TLBaseShape,
  getDefaultColorTheme,
  getUserPreferences,
  track,
  useEditor,
} from "@tldraw/tldraw";
import React from "react";
import { CustomShapeUtil } from "./CustomShape";
import { flexColumnStyle, flexRowStyle, updateShapeFields } from "../common";
import { FaDice, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useChat, useRoll } from "../hooks";
import { CsField, CsFontSelect } from "../component/CustomSettings";
import { actionButtonStyle } from "./styles.css";

export type RpgAttrShape = TLBaseShape<
  "rpg-attr",
  {
    w: number;
    h: number;
    label: string;
    dice: string;
    color: string;
    value: number;
    owner: string;
    font: string;
    revActionColor: boolean;
    actionsUp?: boolean;
  }
>;

export class RpgAttrShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-attr";
  override shapeType = "rpg-attr";
  static override initial = "idle";
}

const shapeProps: ShapeProps<RpgAttrShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  dice: T.string,
  color: T.string,
  value: T.number,
  owner: T.string,
  font: T.string,
  revActionColor: T.boolean,
  actionsUp: T.optional(T.boolean),
};

const RpgAttrSettings = track(({ shape }: { shape: RpgAttrShape }) => {
  return (
    <div
      className={flexColumnStyle({})}
      style={{ padding: "5px", gap: "10px" }}
    >
      <CsField shape={shape} field="color" title="Color" vtype="color" />
      <CsField
        shape={shape}
        field="revActionColor"
        title="Colorize actions"
        vtype="boolean"
      />
      <CsField shape={shape} field="label" title="Label" vtype="string" />
      <CsField
        shape={shape}
        field="dice"
        title="Dice notation"
        vtype="string"
      />
      <CsFontSelect shape={shape} title="Font" field="font" />
      <CsField shape={shape} field="value" title="Value" vtype="number" />
      <CsField
        shape={shape}
        field="actionsUp"
        title="Action at top"
        vtype="boolean"
      />
    </div>
  );
});

const RpgAttrMain = track(({ shape }: { shape: RpgAttrShape }) => {
  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
        alignItems: "center",
      }}
    >
      <svg
        height={shape.props.h}
        width={shape.props.w}
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          x="50%"
          y="60%"
          fontSize={shape.props.h}
          fontFamily={`var(--tl-font-${shape.props.font})`}
          fill="currentColor"
        >
          {shape.props.value}
        </text>
      </svg>
    </div>
  );
});

const RpgAttrActions = ({ shape }: { shape: RpgAttrShape }) => {
  const editor = useEditor();
  const user = getUserPreferences();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });
  const { rollSingleToChat } = useRoll(user, theme);
  const { addChatMessage } = useChat(editor);

  const inc = (value: number) => {
    const val = shape.props.value + value;
    updateShapeFields(editor, shape, { value: val });
  };

  const reset = () => {
    updateShapeFields(editor, shape, { value: 0 });
  };

  const roll = () => {
    if (shape.props.dice === "") return;
    const v =
      shape.props.value > 0 ? `+${shape.props.value}` : `${shape.props.value}`;
    const msg = rollSingleToChat(
      `${shape.props.dice}${v}`,
      false,
      shape.props.label
    );
    addChatMessage(msg);
  };

  return (
    <div
      className={flexRowStyle({ justify: "center" })}
      style={{ flexWrap: "nowrap", gap: "2px" }}
    >
      <Button
        type="icon"
        title="Decrease"
        onPointerDown={() => inc(-1)}
        className={actionButtonStyle}
      >
        <FaMinusCircle
          size={16}
          fill={shape.props.revActionColor ? shape.props.color : "currentColor"}
        />
      </Button>
      {shape.props.dice !== "" && (
        <Button
          type="icon"
          title="Roll dice"
          onPointerDown={roll}
          className={actionButtonStyle}
        >
          <FaDice
            size={16}
            fill={
              shape.props.revActionColor ? shape.props.color : "currentColor"
            }
          />
        </Button>
      )}
      <Button
        type="icon"
        title="Increase"
        onPointerDown={() => inc(1)}
        className={actionButtonStyle}
      >
        <FaPlusCircle
          size={16}
          fill={shape.props.revActionColor ? shape.props.color : "currentColor"}
        />
      </Button>
    </div>
  );
};

export class RpgAttrShapeUtil extends CustomShapeUtil<RpgAttrShape> {
  static override type = "rpg-attr" as const;
  static override props = shapeProps;
  override actionsCount = 3;

  override getDefaultProps(): RpgAttrShape["props"] {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });
    return {
      w: 150,
      h: 150,
      label: "",
      dice: "",
      color: theme.text,
      value: 0,
      owner: "",
      font: "draw",
      revActionColor: false,
    };
  }

  override settingsComponent(shape: RpgAttrShape): React.JSX.Element | null {
    return <RpgAttrSettings shape={shape} />;
  }

  override mainComponent(shape: RpgAttrShape): React.JSX.Element | null {
    return <RpgAttrMain shape={shape} />;
  }

  override actionComponent(shape: RpgAttrShape): React.JSX.Element | null {
    return <RpgAttrActions shape={shape} />;
  }
}
