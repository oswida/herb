import {
  BaseBoxShapeTool,
  ShapeProps,
  T,
  TLBaseShape,
  TLShapeId,
  TldrawUiButton,
  getDefaultColorTheme,
  getUserPreferences,
  track,
  useDefaultHelpers,
  useEditor,
} from "@tldraw/tldraw";
import React, { useCallback, useMemo } from "react";

import { FaDice, FaReplyAll } from "react-icons/fa";
import {
  RollValue,
  flexColumnStyle,
  flexRowStyle,
  rollValues,
} from "../common";
import { useRoll } from "../hooks";
import { DiceRollerPool } from "./DiceRollerPool";
import { CsField } from "../component/CustomSettings";
import { CustomShapeUtil } from "./CustomShape";
import { RpgDiceShape } from "./DiceShape";

export type RpgDiceRollerShape = TLBaseShape<
  "rpg-dice-roller",
  {
    w: number;
    h: number;
    label: string;
    color: string;
    background: string;
    owner: string;
    _pool: Record<string, number>;
    _roll: Record<string, RollValue[]>;
    numericSix: boolean;
  }
>;

export class RpgDiceRollerShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-dice-roller";
  override shapeType = "rpg-dice-roller";
  static override initial = "idle";
}

const shapeProps: ShapeProps<RpgDiceRollerShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  owner: T.string,
  color: T.string,
  background: T.string,
  _pool: T.dict(T.string, T.number),
  _roll: T.dict(T.string, T.arrayOf<RollValue>(T.any)),
  numericSix: T.boolean,
};

const RpgDiceRollerSettings = track(
  ({ shape }: { shape: RpgDiceRollerShape }) => {
    const { addDialog } = useDefaultHelpers();

    const selectPool = () => {
      addDialog({
        id: "dice-pool",
        component: ({ onClose }) => (
          <DiceRollerPool onClose={onClose} shape={shape} />
        ),
        onClose: () => {},
      });
    };

    return (
      <div
        className={flexColumnStyle({})}
        style={{ padding: "5px", gap: "10px" }}
      >
        <CsField shape={shape} field="color" title="Color" vtype="color" />
        <CsField
          shape={shape}
          field="numericSix"
          title="D6 dice as numbers"
          vtype="boolean"
        />
        <TldrawUiButton
          type="normal"
          onPointerDown={selectPool}
          style={{ gap: 20 }}
        >
          <FaDice size={16} />
          <span>Select dice pool</span>
        </TldrawUiButton>
      </div>
    );
  }
);

const RpgDiceRollerMain = track(({ shape }: { shape: RpgDiceRollerShape }) => {
  const notation = useMemo(() => {
    const res: string[] = [];
    Object.keys(shape.props._pool).forEach((k) => {
      res.push(`${shape.props._pool[k]}${k}`);
    });
    return res.join("+");
  }, [shape]);

  const notationStr = useMemo(() => {
    return notation.replaceAll("dTd", "d6 ⚫").replaceAll("dTl", "d6 ⚪");
  }, [notation]);

  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
        backgroundColor: shape.props.background,
        alignItems: "center",
        width: shape.props.w,
        height: shape.props.h,
      }}
    >
      <div>{shape.props.label}</div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M388.53 21.53c-38.006 30.546-63.492 66.122-83.952 103.687 12.746 7.812 25.587 14.923 38.516 21.38l88.744 34.04c13.746 3.8 27.583 6.995 41.51 9.625 13.493-42.908 19.872-85.824 19.433-128.73l-104.25-40zm-266.813 3.88l15.133 64.967 68.95 16.38-12.993-64.525-71.09-16.822zm-17.594 6.848L66.896 79.803l12.358 62.025 39.494-46.785-14.625-62.785zm27.783 76.148l-37.094 43.97 52.165 7.718c7.243-2.11 14.482-4.097 21.716-5.967l27.62-30.408-64.407-15.314zm170.57 37.346l8.776 58.912c5.91 6.06 11.636 12.256 17.13 18.615l89.024 34.157 45.317-50.218c-54.72-11.1-108.31-30.82-160.248-61.468zm-70.09 13.482c-49.324 9.35-98.335 21.9-147.224 42.645 40.825 34.878 76.848 72.364 105.988 113.538l149.204-44.686c-26.533-41.862-66.002-77.02-107.97-111.498zM65.71 209.848C45.093 260.13 28.07 311.115 24.24 367.025c24.535 52.892 70.202 90.623 110.764 119.72l42.476-158.45c-29.975-42.853-68.05-81.942-111.77-118.447zM351.07 287.03L195.39 333.66l-42.146 157.22c52.167-7.854 103.99-21.873 155.822-48.26 24.952-53.52 30.504-99.728 42.002-155.587z"
        />
      </svg>

      <div>{notationStr}</div>
    </div>
  );
});

const RpgDiceRollerActions = ({ shape }: { shape: RpgDiceRollerShape }) => {
  const editor = useEditor();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });
  const user = getUserPreferences();
  const { rollSingleToChat, rollSimple } = useRoll(user, theme);

  const notation = useMemo(() => {
    const res: string[] = [];
    Object.keys(shape.props._pool).forEach((k) => {
      res.push(`${shape.props._pool[k]}${k}`);
    });
    return res.join("+");
  }, [shape]);

  const shapeFromRoll = (val: RollValue, marker: string, counter: number) => {
    let clr = "var(--color-text)";
    let bkg = "transparent";
    switch (marker) {
      case "trophy_dark":
        {
          clr = "black";
          bkg = "white";
        }
        break;
      case "trophy_light":
        {
          clr = "white";
          bkg = "black";
        }
        break;
      default:
        {
          clr = "var(--color-text)";
          bkg = "var(--color-background)";
        }
        break;
    }
    return {
      id: `${shape.id}-roll-${counter}`,
      type: "rpg-dice",
      props: {
        _background: bkg,
        _color: clr,
        _face: Number.parseInt(val.dice.replaceAll("d", "")),
        _value: val.value,
        _isMax: val.isMax,
        _isMin: val.isMin,
        _numericSix: shape.props.numericSix,
      },
    } as RpgDiceShape;
  };

  const clearChildren = () => {
    const tr: TLShapeId[] = [];
    editor.getCurrentPageShapeIds().forEach((id) => {
      if (id.startsWith(`${shape.id}-roll-`)) tr.push(id);
    });
    editor.deleteShapes(tr);
  };

  const area = useMemo(() => {
    const sx = shape.x + shape.props.w + 20;
    const sy = shape.y;
    const len = Object.keys(shape.props._pool).length;
    const dx = sx + len * 60;
    const dy = sy + len * 60;
    return [sx, sy, dx, dy, dx - sx, dy - sy];
  }, [shape]);

  const places = useCallback(
    (num: number) => {
      const x = rollSimple(`${num}d${area[4]}`);
      const y = rollSimple(`${num}d${area[5]}`);
      const res = [];
      for (let i = 0; i < num; i++) {
        res.push({ x: area[0] + x[i], y: area[1] + y[i] });
      }
      return res;
    },
    [area]
  );

  const insertDice = useCallback(() => {
    clearChildren();
    if (notation === "") return;
    const msg = rollSingleToChat(notation, false);
    const values = rollValues("white", msg.roll, msg.rollMarkers);
    const dr: Record<string, RollValue[]> = {};
    if (!msg.rollMarkers) return;
    let dy = 10;
    let cnt = 1;
    for (let i = 0; i < msg.rollMarkers!.length; i++) {
      dr[msg.rollMarkers[i]] = values[i];
      let dx = 0;
      const pos = places(values[i].length);
      let c = 0;
      values[i].forEach((rv) => {
        const shp = shapeFromRoll(rv, msg.rollMarkers![i], cnt);
        cnt++;
        shp.x = pos[c].x;
        shp.y = pos[c].y;
        editor.createShape(shp);
        dx += 48;
        c++;
      });
      dy += 48;
    }
    editor.updateShape<RpgDiceRollerShape>({
      id: shape.id,
      type: "rpg-dice-roller",
      props: {
        _roll: dr,
      },
    });
  }, [shape]);

  return (
    <div
      className={flexRowStyle({ justify: "center" })}
      style={{ flexWrap: "nowrap", gap: "2px" }}
    >
      <TldrawUiButton type="icon" title="Roll" onPointerDown={insertDice}>
        <FaDice size={16} />
      </TldrawUiButton>
      <TldrawUiButton
        type="icon"
        title="Clean dice"
        onPointerDown={clearChildren}
      >
        <FaReplyAll size={16} />
      </TldrawUiButton>
    </div>
  );
};

export class RpgDiceRollerShapeUtil extends CustomShapeUtil<RpgDiceRollerShape> {
  static override type = "rpg-dice-roller" as const;
  static override props = shapeProps;
  override actionsCount = 2;

  override getDefaultProps(): RpgDiceRollerShape["props"] {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });
    return {
      w: 150,
      h: 150,
      label: "",
      owner: "",
      color: theme.text,
      background: theme.background,
      _pool: {},
      _roll: {},
      numericSix: false,
    };
  }

  override settingsComponent(
    shape: RpgDiceRollerShape
  ): React.JSX.Element | null {
    return <RpgDiceRollerSettings shape={shape} />;
  }

  override mainComponent(shape: RpgDiceRollerShape): React.JSX.Element | null {
    return <RpgDiceRollerMain shape={shape} />;
  }

  override actionComponent(
    shape: RpgDiceRollerShape
  ): React.JSX.Element | null {
    return <RpgDiceRollerActions shape={shape} />;
  }
}

// type DiceRollerComponentProps = {
//   shape: IDiceRollerShape;
//   bounds: Box2d;
// };

// export const DiceRollerComponent = track(
//   ({ shape, bounds }: DiceRollerComponentProps) => {
//     const editor = useEditor();
//     const isEditing = useIsEditing(shape.id);
//     const user = getUserPreferences();
//     const theme = getDefaultColorTheme({
//       isDarkMode: editor.user.getIsDarkMode(),
//     });
//     const { addDialog } = useDialogs();
//     const { rollSingleToChat, rollSimple } = useRoll(user, theme);

//     const notation = useMemo(() => {
//       const res: string[] = [];
//       Object.keys(shape.props.pool).forEach((k) => {
//         res.push(`${shape.props.pool[k]}${k}`);
//       });
//       return res.join("+");
//     }, [shape]);

//     const shapeFromRoll = (val: RollValue, marker: string, counter: number) => {
//       let clr = "var(--color-text)";
//       let bkg = "transparent";
//       switch (marker) {
//         case "trophy_dark":
//           {
//             clr = "black";
//             bkg = "white";
//           }
//           break;
//         case "trophy_light":
//           {
//             clr = "white";
//             bkg = "black";
//           }
//           break;
//         default:
//           {
//             clr = "var(--color-text)";
//             bkg = "var(--color-background)";
//           }
//           break;
//       }
//       return {
//         id: `${shape.id}-roll-${counter}`,
//         type: "dice",
//         props: {
//           background: bkg,
//           fill: clr,
//           face: Number.parseInt(val.dice.replaceAll("d", "")),
//           value: val.value,
//           owner: editor.user.getId(),
//           isMax: val.isMax,
//           isMin: val.isMin,
//           numericSix: shape.props.numericSix,
//         },
//       } as IDiceShape;
//     };

//     const clearChildren = () => {
//       const tr: TLShapeId[] = [];
//       editor.getCurrentPageShapeIds().forEach((id) => {
//         if (id.startsWith(`${shape.id}-roll-`)) tr.push(id);
//       });
//       editor.deleteShapes(tr);
//     };

//     const area = useMemo(() => {
//       const sx = shape.x + shape.props.w + 20;
//       const sy = shape.y;
//       const len = Object.keys(shape.props.pool).length;
//       const dx = sx + len * 60;
//       const dy = sy + len * 60;
//       return [sx, sy, dx, dy, dx - sx, dy - sy];
//     }, [shape]);

//     const places = useCallback(
//       (num: number) => {
//         const x = rollSimple(`${num}d${area[4]}`);
//         const y = rollSimple(`${num}d${area[5]}`);
//         const res = [];
//         for (let i = 0; i < num; i++) {
//           res.push({ x: area[0] + x[i], y: area[1] + y[i] });
//         }
//         return res;
//       },
//       [area]
//     );

//     const insertDice = useCallback(() => {
//       clearChildren();
//       const msg = rollSingleToChat(notation, false);
//       const values = rollValues("white", msg.roll, msg.rollMarkers);
//       const dr: Record<string, RollValue[]> = {};
//       if (!msg.rollMarkers) return;
//       //const center = editor.getViewportPageCenter();
//       let dy = 10;
//       let cnt = 1;
//       for (let i = 0; i < msg.rollMarkers!.length; i++) {
//         dr[msg.rollMarkers[i]] = values[i];
//         let dx = 0;
//         const pos = places(values[i].length);
//         let c = 0;
//         values[i].forEach((rv) => {
//           const shp = shapeFromRoll(rv, msg.rollMarkers![i], cnt);
//           cnt++;
//           shp.x = pos[c].x;
//           shp.y = pos[c].y;
//           editor.createShape(shp);
//           dx += 48;
//           c++;
//         });
//         dy += 48;
//       }
//       editor.updateShape<IDiceRollerShape>({
//         id: shape.id,
//         type: "rpg-dice-roller",
//         props: {
//           roll: dr,
//         },
//       });
//     }, [shape]);

//     const selectPool = () => {
//       addDialog({
//         id: "dice-pool",
//         component: ({ onClose }) => (
//           <DiceRollerPool onClose={onClose} shape={shape} />
//         ),
//         onClose: () => {},
//       });
//     };

//     const notationStr = useMemo(() => {
//       return notation.replaceAll("dTd", "d6 ⚫").replaceAll("dTl", "d6 ⚪");
//     }, [notation]);

//     if (!shape) return <></>;

//     return (
//       <div
//         id={shape.id}
//         className={flexColumnStyle({})}
//         style={{
//           color: shape.props.fill,
//           backgroundColor: shape.props.background,
//           width: shape.props.w,
//           height: shape.props.h,
//           alignItems: "center",
//           position: "relative",
//         }}
//       >
//         <div>{shape.props.label}</div>
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//           <path
//             fill="currentColor"
//             d="M388.53 21.53c-38.006 30.546-63.492 66.122-83.952 103.687 12.746 7.812 25.587 14.923 38.516 21.38l88.744 34.04c13.746 3.8 27.583 6.995 41.51 9.625 13.493-42.908 19.872-85.824 19.433-128.73l-104.25-40zm-266.813 3.88l15.133 64.967 68.95 16.38-12.993-64.525-71.09-16.822zm-17.594 6.848L66.896 79.803l12.358 62.025 39.494-46.785-14.625-62.785zm27.783 76.148l-37.094 43.97 52.165 7.718c7.243-2.11 14.482-4.097 21.716-5.967l27.62-30.408-64.407-15.314zm170.57 37.346l8.776 58.912c5.91 6.06 11.636 12.256 17.13 18.615l89.024 34.157 45.317-50.218c-54.72-11.1-108.31-30.82-160.248-61.468zm-70.09 13.482c-49.324 9.35-98.335 21.9-147.224 42.645 40.825 34.878 76.848 72.364 105.988 113.538l149.204-44.686c-26.533-41.862-66.002-77.02-107.97-111.498zM65.71 209.848C45.093 260.13 28.07 311.115 24.24 367.025c24.535 52.892 70.202 90.623 110.764 119.72l42.476-158.45c-29.975-42.853-68.05-81.942-111.77-118.447zM351.07 287.03L195.39 333.66l-42.146 157.22c52.167-7.854 103.99-21.873 155.822-48.26 24.952-53.52 30.504-99.728 42.002-155.587z"
//           />
//         </svg>

//         <div>{notationStr}</div>
//         {isEditing && (
//           <>
//             <Button
//               type="icon"
//               title="Dice pool"
//               onPointerDown={selectPool}
//               style={{ position: "absolute", left: -40, top: 0 }}
//             >
//               <FaDiceD6 size={16} />
//             </Button>
//             <Button
//               type="icon"
//               title="Roll"
//               onPointerDown={insertDice}
//               style={{ position: "absolute", right: -40, top: 0 }}
//             >
//               <FaPlayCircle size={16} />
//             </Button>
//             <Button
//               type="icon"
//               title="Clean dice"
//               style={{ position: "absolute", left: -40, bottom: 0 }}
//               onPointerDown={clearChildren}
//             >
//               <FaReplyAll size={16} />
//             </Button>
//           </>
//         )}
//       </div>
//     );
//   }
// );

// export class DiceRollerShapeTool extends BaseBoxShapeTool {
//   static override id = "rpg-dice-roller";
//   static override initial = "idle";
//   override shapeType = "rpg-dice-roller";

//   override onDoubleClick: TLClickEvent = (_info) => {};
// }

// export const rpgDiceShapeProps: ShapeProps<IDiceRollerShape> = {
//   w: T.number,
//   h: T.number,
//   fill: T.string,
//   background: T.string,
//   owner: T.string,
//   pool: T.dict(T.string, T.number),
//   roll: T.dict(T.string, T.arrayOf<RollValue>(T.any)),
//   label: T.string,
//   numericSix: T.boolean,
// };

// export class DiceRollerShapeUtil extends BaseBoxShapeUtil<IDiceRollerShape> {
//   static override type = "rpg-dice-roller" as const;
//   static override props = rpgDiceShapeProps;

//   override canResize = (_shape: IDiceRollerShape) => true;
//   override canEditInReadOnly = () => false;
//   override canEdit: TLShapeUtilFlag<IDiceRollerShape> = () => true;

//   getDefaultProps(): IDiceRollerShape["props"] {
//     return {
//       w: 70,
//       h: 90,
//       fill: "var(--color-text)",
//       background: "transparent",
//       owner: "",
//       pool: { dTl: 2, dTd: 2, d4: 2 },
//       roll: {},
//       label: "Dice roller",
//       numericSix: true,
//     };
//   }

//   getGeometry(shape: IDiceRollerShape) {
//     return new Rectangle2d({
//       width: shape.props.w,
//       height: shape.props.h,
//       isFilled: true,
//     });
//   }

//   component(shape: IDiceRollerShape) {
//     const bounds = this.editor.getShapeGeometry(shape).bounds;
//     return <DiceRollerComponent bounds={bounds} shape={shape} key={shape.id} />;
//   }

//   indicator(shape: IDiceRollerShape) {
//     return <rect width={shape.props.w} height={shape.props.h} />;
//   }

//   override onResize: TLOnResizeHandler<IDiceRollerShape> = (shape, info) => {
//     return resizeBox(shape, info);
//   };

//   override onBeforeCreate: TLOnBeforeCreateHandler<IDiceRollerShape> = (
//     next
//   ) => {
//     return {
//       ...next,
//       props: { ...next.props, owner: this.editor.user.getId() },
//     };
//   };
// }
