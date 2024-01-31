import {
  BaseBoxShapeTool,
  Button,
  Rectangle2d,
  ShapeProps,
  T,
  TLBaseShape,
  TLShapePartial,
  getDefaultColorTheme,
  getUserPreferences,
  track,
  useEditor,
} from "@tldraw/tldraw";
import React, { useCallback, useMemo } from "react";
import { CustomShapeUtil } from "./CustomShape";
import { flexColumnStyle, flexRowStyle, updateShapeFields } from "../common";
import { FaDice, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useChat, useRoll } from "../hooks";
import {
  CsField,
  CsFontSelect,
  CsResetColors,
} from "../component/CustomSettings";
import { actionButtonStyle } from "./styles.css";

export type RpgAttrShape = TLBaseShape<
  "rpg-attr",
  {
    w: number;
    h: number;
    label: string;
    dice: string;
    color: string;
    background: string;
    value: number;
    owner: string;
    font: string;
    actionsVertical: boolean;
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
  background: T.string,
  value: T.number,
  owner: T.string,
  font: T.string,
  actionsVertical: T.boolean,
};

const RpgAttrSettings = track(({ shape }: { shape: RpgAttrShape }) => {
  const editor = useEditor();
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
        field="actionsVertical"
        title="Vertical actions"
        vtype="boolean"
      />
    </div>
  );
});

const RpgAttrMain = track(({ shape }: { shape: RpgAttrShape }) => {
  const editor = useEditor();
  const inc = (value: number) => {
    const val = shape.props.value + value;
    updateShapeFields(editor, shape, { value: val });
  };
  const isSelected = useMemo(() => {
    return shape.id === editor.getOnlySelectedShape()?.id;
  }, [editor, shape, editor.getOnlySelectedShape()]);

  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
        backgroundColor: shape.props.background,
        borderRadius: 10,
        alignItems: "center",
        width: shape.props.w,
        height: shape.props.h,
      }}
    >
      {shape.props.actionsVertical && (
        <div
          className={flexColumnStyle({})}
          style={{
            alignItems: "center",
            width: shape.props.w,
            height: shape.props.h,
            gap: 1,
          }}
        >
          <Button
            type="icon"
            title="Increase"
            onPointerDown={() => inc(1)}
            style={{ visibility: !isSelected ? "hidden" : undefined }}
          >
            <FaPlusCircle size={16} fill={shape.props.color} />
          </Button>
          <svg
            height={shape.props.h - 80}
            width={shape.props.w}
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              x="50%"
              y="60%"
              fontSize={shape.props.h - 80}
              fontFamily={`var(--tl-font-${shape.props.font})`}
              fill="currentColor"
            >
              {shape.props.value}
            </text>
          </svg>

          <Button
            type="icon"
            title="Decrease"
            onPointerDown={() => inc(-1)}
            style={{ visibility: !isSelected ? "hidden" : undefined }}
          >
            <FaMinusCircle size={16} fill={shape.props.color} />
          </Button>
        </div>
      )}
      {!shape.props.actionsVertical && (
        <div className={flexRowStyle({ justify: "center" })}>
          {isSelected && (
            <Button type="icon" title="Decrease" onPointerDown={() => inc(-1)}>
              <FaMinusCircle size={16} fill={shape.props.color} />
            </Button>
          )}
          <svg
            height={shape.props.h}
            width={shape.props.w - 80}
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
          {isSelected && (
            <Button type="icon" title="Increase" onPointerDown={() => inc(1)}>
              <FaPlusCircle size={16} fill={shape.props.color} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

// const RpgAttrActions = ({ shape }: { shape: RpgAttrShape }) => {
//   const editor = useEditor();
//   const user = getUserPreferences();
//   const theme = getDefaultColorTheme({
//     isDarkMode: editor.user.getIsDarkMode(),
//   });
//   const { rollSingleToChat } = useRoll(user, theme);
//   const { addChatMessage } = useChat(editor);

//   const inc = (value: number) => {
//     const val = shape.props.value + value;
//     updateShapeFields(editor, shape, { value: val });
//   };

//   const reset = () => {
//     updateShapeFields(editor, shape, { value: 0 });
//   };

//   const roll = () => {
//     if (shape.props.dice === "") return;
//     const v =
//       shape.props.value > 0 ? `+${shape.props.value}` : `${shape.props.value}`;
//     const msg = rollSingleToChat(
//       `${shape.props.dice}${v}`,
//       false,
//       shape.props.label
//     );
//     addChatMessage(msg);
//   };

//   return (
//     <div
//       className={flexRowStyle({ justify: "center" })}
//       style={{ flexWrap: "nowrap", gap: "2px" }}
//     >
//       <Button
//         type="icon"
//         title="Decrease"
//         onPointerDown={() => inc(-1)}
//         className={actionButtonStyle}
//       >
//         <FaMinusCircle
//           size={16}
//           fill={shape.props.revActionColor ? shape.props.color : "currentColor"}
//         />
//       </Button>
//       {shape.props.dice !== "" && (
//         <Button
//           type="icon"
//           title="Roll dice"
//           onPointerDown={roll}
//           className={actionButtonStyle}
//         >
//           <FaDice
//             size={16}
//             fill={
//               shape.props.revActionColor ? shape.props.color : "currentColor"
//             }
//           />
//         </Button>
//       )}
//       <Button
//         type="icon"
//         title="Increase"
//         onPointerDown={() => inc(1)}
//         className={actionButtonStyle}
//       >
//         <FaPlusCircle
//           size={16}
//           fill={shape.props.revActionColor ? shape.props.color : "currentColor"}
//         />
//       </Button>
//     </div>
//   );
// };

export class RpgAttrShapeUtil extends CustomShapeUtil<RpgAttrShape> {
  static override type = "rpg-attr" as const;
  static override props = shapeProps;
  override actionsCount = 0;

  override getDefaultProps(): RpgAttrShape["props"] {
    return {
      w: 150,
      h: 150,
      label: "",
      dice: "",
      color: "var(--color-text)",
      value: 0,
      owner: "",
      font: "draw",
      actionsVertical: false,
      background: "var(--color-background)",
    };
  }

  // override getGeometry(shape: RpgAttrShape) {
  //   return new Rectangle2d({
  //     width: shape.props.actionsVertical ? shape.props.w : shape.props.w + 80,
  //     height: shape.props.actionsVertical ? shape.props.h + 80 : shape.props.h,
  //     isFilled: true,
  //   });
  // }

  // override indicator(shape: RpgAttrShape) {
  //   return <rect width={shape.props.w} height={shape.props.h} />;
  // }

  override settingsComponent(shape: RpgAttrShape): React.JSX.Element | null {
    return <RpgAttrSettings shape={shape} />;
  }

  override mainComponent(shape: RpgAttrShape): React.JSX.Element | null {
    return <RpgAttrMain shape={shape} />;
  }

  override actionComponent(shape: RpgAttrShape): React.JSX.Element | null {
    return null;
  }
}
