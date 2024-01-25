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
import React from "react";
import { CustomShapeUtil } from "./CustomShape";
import {
  compactColors,
  flexColumnStyle,
  flexRowStyle,
  rollNotationWithResults,
  updateShapeFields,
} from "../common";
import { Circle, Compact } from "@uiw/react-color";
import { CsColor, CsInput } from "../component/CustomSettings";
import { CheckItem } from "../component/CheckItem";
import { FaDice, FaDiceD20, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useChat, useRoll } from "../hooks";

export type RpgAttrShape = TLBaseShape<
  "rpg-attr",
  {
    w: number;
    h: number;
    label: string;
    dice: string;
    color: string;
    value: number;
  }
>;

export class RpgAttrShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-attr";
  override shapeType = "rpg-attr";
  static override initial = "idle";
}

export const shapeProps: ShapeProps<RpgAttrShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  dice: T.string,
  color: T.string,
  value: T.number,
};

const RpgAttrSettings = track(({ shape }: { shape: RpgAttrShape }) => {
  return (
    <div
      className={flexColumnStyle({})}
      style={{ padding: "5px", gap: "10px" }}
    >
      <CsColor shape={shape} field="color" title="Color" />
      <CsInput shape={shape} field="label" title="Label" />
      <CsInput shape={shape} field="dice" title="Dice notation" />
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
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });
  const { rollSingleToChat } = useRoll(editor.user, theme);
  const { addChatMessage } = useChat(editor);

  const inc = (value: number) => {
    const val = shape.props.value + value;
    updateShapeFields(editor, shape, { value: val });
  };

  const roll = () => {
    if (shape.props.dice === "") return;
    const v =
      shape.props.value > 0 ? `+${shape.props.value}` : `${shape.props.value}`;
    console.log("roll", v, `${shape.props.dice}${v}`);
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
        style={{ minHeight: "16px", minWidth: "16px" }}
      >
        <FaMinusCircle size={16} />
      </Button>
      {shape.props.dice !== "" && (
        <Button
          type="icon"
          title="Roll dice"
          onPointerDown={roll}
          style={{ minHeight: "16px", minWidth: "16px" }}
        >
          <FaDice size={16} />
        </Button>
      )}
      <Button
        type="icon"
        title="Increase"
        onPointerDown={() => inc(1)}
        style={{ minHeight: "16px", minWidth: "16px" }}
      >
        <FaPlusCircle size={16} />
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
    };
  }

  override settingsComponent(shape: RpgAttrShape): React.JSX.Element {
    return <RpgAttrSettings shape={shape} />;
  }

  override mainComponent(shape: RpgAttrShape): React.JSX.Element {
    return <RpgAttrMain shape={shape} />;
  }

  override actionComponent(shape: RpgAttrShape): React.JSX.Element {
    return <RpgAttrActions shape={shape} />;
  }
}
