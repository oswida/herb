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
import React, { useCallback } from "react";
import { diceRollerVisible, flexColumnStyle, flexRowStyle } from "../common";
import { CsField, CsFontSelect } from "../component/CustomSettings";
import { CustomShapeUtil } from "./CustomShape";
import { useChat, useRoll } from "../hooks";
import { PbtaInfo } from "./PbtaInfo";
import { useAtom } from "jotai";
import { ImDice } from "react-icons/im";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import { cardButtonStyle } from "./styles.css";

export type RpgPbtaRollShape = TLBaseShape<
  "rpg-pbta-roll",
  {
    w: number;
    h: number;
    label: string;
    owner: string;
    color: string;
    font: string;
    background: string;
    revActionColor: boolean;
    modifierLabel: string;
    rollInfo1: string;
    rollInfo2: string;
    rollInfo3: string;
    triggerInfo: string;
    hasOwnModifier?: boolean;
    ownModifierValue?: number;
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
  hasOwnModifier: T.optional(T.boolean),
  ownModifierValue: T.optional(T.number),
};

const RpgPbtaRollSettings = ({ shape }: { shape: RpgPbtaRollShape }) => {
  const editor = useEditor();
  const { addDialog } = useDefaultHelpers();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });

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

  const resetColors = useCallback(() => {
    const shapeUpdate: TLShapePartial<any> = {
      id: shape.id,
      type: shape.type,
      props: {
        color: "var(--color-text)",
        background: "var(--color-background)",
      },
    };
    editor.updateShapes([shapeUpdate]);
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
        field="background"
        title="Background"
        vtype="color"
      />
      <Button type="normal" onPointerDown={resetColors}>
        Reset colors
      </Button>
      <CsField shape={shape} field="label" title="Label" vtype="string" />
      <CsField
        shape={shape}
        field="modifierLabel"
        title="Attribute label"
        vtype="string"
      />
      <CsField
        shape={shape}
        field="hasOwnModifier"
        title="Has own modifier"
        vtype="boolean"
      />
      <CsFontSelect field="font" title="Font" shape={shape} />
      <Button type="normal" onPointerDown={desc}>
        Set roll descriptions
      </Button>
    </div>
  );
};

const RpgPbtaRollMain = track(({ shape }: { shape: RpgPbtaRollShape }) => {
  const editor = useEditor();
  const user = getUserPreferences();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });
  const { rollSingleToChat } = useRoll(user, theme);
  const { addChatMessage } = useChat(editor);
  const [visible, setVisible] = useAtom(diceRollerVisible);

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
    let v = 0;
    if (shape.props.modifierLabel !== "") {
      const attr = findAttr(shape.props.modifierLabel);
      if (attr && (attr.props as any).value) {
        v = (attr.props as any).value as number;
      }
    }
    if (
      shape.props.hasOwnModifier &&
      shape.props.ownModifierValue !== undefined
    ) {
      v = v + shape.props.ownModifierValue;
    }
    if (v !== 0) {
      mod = v > 0 ? `+${v}` : `${v}`;
    }
    const msg = rollSingleToChat(`2d6${mod}`, false, shape.props.label);
    const total = msg.roll?.total;
    if (!total) return;
    if (total <= 6) {
      msg.comment = `${shape.props.label}\n ${shape.props.rollInfo1}`;
    } else if (total >= 10) {
      msg.comment = `${shape.props.label}\n ${shape.props.rollInfo3}`;
    } else {
      msg.comment = `${shape.props.label}\n ${shape.props.rollInfo2}`;
    }
    addChatMessage(msg);
    if (!visible) setVisible(true);
  };

  const mod = useCallback(
    (val: number) => {
      const shapeUpdate: TLShapePartial<any> = {
        id: shape.id,
        type: shape.type,
        props: {
          ownModifierValue:
            shape.props.ownModifierValue !== undefined
              ? shape.props.ownModifierValue + val
              : val,
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
        backgroundColor: shape.props.background,
        width: shape.props.w,
        height: shape.props.h,
        alignItems: "center",
        padding: 7,
        borderRadius: 10,
        border: `solid 1px ${shape.props.color}`,
      }}
    >
      <div
        style={{
          width: "100%",
          fontSize: "1.5rem",
          textAlign: "center",
          fontFamily: `var(--tl-font-${shape.props.font})`,
        }}
      >
        {shape.props.label}
      </div>

      {shape.props.triggerInfo !== "" && (
        <>
          <div
            style={{
              width: "90%",
              height: "1px",
              backgroundColor: shape.props.color,
            }}
          />
          <div
            style={{
              fontFamily: `var(--tl-font-${shape.props.font})`,
              fontSize: "0.9rem",
              wordWrap: "break-word",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              width: "100%",
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            {shape.props.triggerInfo}
          </div>
        </>
      )}

      <div
        style={{
          width: "90%",
          height: "1px",
          backgroundColor: shape.props.color,
        }}
      />
      <div
        className={flexRowStyle({ justify: "space" })}
        style={{ flex: 1, width: "90%", color: shape.props.color }}
      >
        <div
          className={flexRowStyle({ justify: "start" })}
          style={{ flex: 1, flexGrow: 1, gap: 5 }}
        >
          {shape.props.hasOwnModifier === true && (
            <>
              <Button type="icon" onPointerDown={() => mod(-1)}>
                <BiMinusCircle fill={shape.props.color} size={20} />
              </Button>
              <div
                style={{
                  fontFamily: `var(--tl-font-${shape.props.font})`,
                  fontSize: "2rem",
                }}
              >
                {shape.props.ownModifierValue !== undefined
                  ? shape.props.ownModifierValue
                  : 0}
              </div>
              <Button type="icon" onPointerDown={() => mod(1)}>
                <BiPlusCircle fill={shape.props.color} size={20} />
              </Button>
            </>
          )}
        </div>
        <Button
          type="icon"
          title="Roll"
          onPointerDown={roll}
          className={cardButtonStyle}
          style={{
            borderRadius: 7,
            borderColor: shape.props.color,
            width: 40,
            height: 40,
          }}
        >
          <ImDice size={28} fill={shape.props.color} />
        </Button>
      </div>
    </div>
  );
});

const RpgPbtaRollActions = ({ shape }: { shape: RpgPbtaRollShape }) => {
  return null;
};

export class RpgPbtaRollShapeUtil extends CustomShapeUtil<RpgPbtaRollShape> {
  static override type = "rpg-pbta-roll" as const;
  static override props = shapeProps;
  override actionsHeight = 0;

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
      hasOwnModifier: false,
      ownModifierValue: 0,
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
