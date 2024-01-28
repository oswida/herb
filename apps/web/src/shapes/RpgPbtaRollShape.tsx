import {
  BaseBoxShapeTool,
  Button,
  ShapeProps,
  T,
  TLBaseShape,
  TLShapePartial,
  getDefaultColorTheme,
  getUserPreferences,
  track,
  useDefaultHelpers,
  useEditor,
} from "@tldraw/tldraw";
import React, { useCallback, useMemo } from "react";
import { flexColumnStyle, flexRowStyle } from "../common";
import { CsField, CsFontSelect } from "../component/CustomSettings";
import { CustomShapeUtil } from "./CustomShape";
import { useChat, useRoll } from "../hooks";
import { PbtaInfo } from "./PbtaInfo";
import { GiDiceSixFacesThree } from "react-icons/gi";

export type RpgPbtaRollShape = TLBaseShape<
  "rpg-pbta-roll",
  {
    w: number;
    h: number;
    label: string;
    owner: string;
    color: string;
    background: string;
    modifierLabel: string;
    rollInfo1: string;
    rollInfo2: string;
    rollInfo3: string;
    triggerInfo: string;
    font: string;
    revActionColor: boolean;
  }
>;

export class RpgPbtaRollShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-pbta-roll";
  override shapeType = "rpg-pbta-roll";
  static override initial = "idle";
}

const shapeProps: ShapeProps<RpgPbtaRollShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  owner: T.string,
  color: T.string,
  background: T.string,
  modifierLabel: T.string,
  rollInfo1: T.string,
  rollInfo2: T.string,
  rollInfo3: T.string,
  font: T.string,
  revActionColor: T.boolean,
  triggerInfo: T.string,
};

const RpgPbtaRollSettings = ({ shape }: { shape: RpgPbtaRollShape }) => {
  const editor = useEditor();

  const setBkg = () => {
    if (!shape) return;
    const shapeUpdate: TLShapePartial<any> = {
      id: shape.id,
      type: shape.type,
      props: {
        background: "transparent",
      },
    };
    editor.updateShapes([shapeUpdate]);
  };

  const { addDialog } = useDefaultHelpers();

  const desc = useCallback(() => {
    if (!shape) return;
    addDialog({
      id: "rpg-pbta-roll-desc",
      component: ({ onClose }) => <PbtaInfo onClose={onClose} shape={shape} />,
      onClose: () => {
        editor.setSelectedShapes([]);
      },
    });
  }, [shape]);

  if (!shape) return null;

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
      <CsField
        shape={shape}
        field="background"
        title="Background"
        vtype="color"
      />
      <Button type="normal" onPointerDown={setBkg}>
        Set transparent background
      </Button>
      <CsField shape={shape} field="label" title="Label" vtype="string" />
      <CsField
        shape={shape}
        field="modifierLabel"
        title="Attribute label"
        vtype="string"
      />
      <CsFontSelect field="font" title="Font" shape={shape} />
      <Button type="normal" onPointerDown={desc}>
        Set roll descriptions
      </Button>
    </div>
  );
};

const RpgPbtaRollMain = track(({ shape }: { shape: RpgPbtaRollShape }) => {
  const lineH = useMemo(() => {
    return shape.props.h / 6;
  }, [shape.props.h, shape]);

  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
        backgroundColor: shape.props.background,
        width: shape.props.w,
        height: shape.props.h,
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <svg
        height={
          shape.props.triggerInfo !== "" ? shape.props.h / 2 : shape.props.h
        }
        width={shape.props.w - 20}
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          x="50%"
          y="60%"
          fontSize={shape.props.triggerInfo !== "" ? lineH * 1.5 : lineH * 3}
          fontFamily={`var(--tl-font-${shape.props.font})`}
          fill="currentColor"
        >
          {shape.props.label}
        </text>
      </svg>
      {shape.props.triggerInfo !== "" && (
        <div
          style={{
            fontFamily: `var(--tl-font-${shape.props.font})`,
            wordWrap: "break-word",
            overflow: "clip",
          }}
        >
          {shape.props.triggerInfo}
        </div>
      )}
    </div>
  );
});

const RpgPbtaRollActions = ({ shape }: { shape: RpgPbtaRollShape }) => {
  const editor = useEditor();
  const user = getUserPreferences();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });
  const { rollSingleToChat } = useRoll(user, theme);
  const { addChatMessage } = useChat(editor);

  const findAttr = (label: string) => {
    return editor
      .getCurrentPageShapes()
      .find(
        (sh) =>
          sh.type === "rpg-attr" &&
          Object.hasOwn(sh.props, "label") &&
          (sh.props as any).label === label
      );
  };

  const roll = () => {
    let mod = "";
    if (shape.props.modifierLabel !== "") {
      const attr = findAttr(shape.props.modifierLabel);
      if (attr && (attr.props as any).value) {
        const v = (attr.props as any).value as number;
        mod = v >= 0 ? `+${v}` : `${v}`;
      }
    }
    const msg = rollSingleToChat(`2d6${mod}`, false, shape.props.label);
    const total = msg.roll?.total;
    if (!total) return;
    if (total <= 6) {
      msg.comment = `${shape.props.label}:\n ${shape.props.rollInfo1}`;
    } else if (total >= 10) {
      msg.comment = `${shape.props.label}:\n ${shape.props.rollInfo3}`;
    } else {
      msg.comment = `${shape.props.label}:\n ${shape.props.rollInfo2}`;
    }
    addChatMessage(msg);
  };

  return (
    <div
      className={flexRowStyle({ justify: "center" })}
      style={{ flexWrap: "nowrap", gap: 15 }}
    >
      <Button type="icon" title="Roll" onPointerDown={roll}>
        <GiDiceSixFacesThree
          size={20}
          fill={shape.props.revActionColor ? shape.props.color : "currentColor"}
        />
      </Button>
    </div>
  );
};

export class RpgPbtaRollShapeUtil extends CustomShapeUtil<RpgPbtaRollShape> {
  static override type = "rpg-pbta-roll" as const;
  static override props = shapeProps;
  override actionsCount = 1;

  override getDefaultProps(): RpgPbtaRollShape["props"] {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });
    return {
      w: 150,
      h: 150,
      label: "PBTA Roll",
      owner: "",
      color: theme.text,
      background: theme.background,
      modifierLabel: "",
      rollInfo1: "",
      rollInfo2: "",
      rollInfo3: "",
      font: "draw",
      revActionColor: false,
      triggerInfo: "",
    };
  }

  override settingsComponent(
    shape: RpgPbtaRollShape
  ): React.JSX.Element | null {
    return <RpgPbtaRollSettings shape={shape} />;
  }

  override mainComponent(shape: RpgPbtaRollShape): React.JSX.Element | null {
    return <RpgPbtaRollMain shape={shape} />;
  }

  override actionComponent(shape: RpgPbtaRollShape): React.JSX.Element | null {
    return <RpgPbtaRollActions shape={shape} />;
  }
}
