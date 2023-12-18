import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  Box2d,
  Button,
  DictValidator,
  Rectangle2d,
  ShapeProps,
  T,
  TLBaseShape,
  TLClickEvent,
  TLOnBeforeCreateHandler,
  TLOnResizeHandler,
  TLShapeId,
  TLShapeUtilFlag,
  getDefaultColorTheme,
  getUserPreferences,
  resizeBox,
  track,
  uniqueId,
  useEditor,
  useIsEditing,
} from "@tldraw/tldraw";
import React, { useCallback, useMemo } from "react";

import dice6_3 from "../../public/icons/dice-six-faces-three.svg";
import { DiceIcon } from "../component/DiceIcon";
import {
  FaDiceD6,
  FaPlay,
  FaPlayCircle,
  FaReplyAll,
  FaTools,
} from "react-icons/fa";
import {
  RollValue,
  flexColumnStyle,
  flexRowStyle,
  rollValues,
} from "../common";
import { useRoll } from "../hooks";
import { IDiceShape } from "./DiceShape";

export type IDiceRollerShape = TLBaseShape<
  "rpg-dice-roller",
  {
    w: number;
    h: number;
    fill: string;
    background: string;
    owner: string;
    pool: Record<string, number>;
    roll: Record<string, RollValue[]>;
    label: string;
  }
>;

type DiceRollerComponentProps = {
  shape: IDiceRollerShape;
  bounds: Box2d;
};

export const DiceRollerComponent = track(
  ({ shape, bounds }: DiceRollerComponentProps) => {
    const editor = useEditor();
    const isEditing = useIsEditing(shape.id);
    const user = getUserPreferences();
    const theme = getDefaultColorTheme({
      isDarkMode: editor.user.getIsDarkMode(),
    });
    const { rollSingleToChat } = useRoll(user, theme);
    // const settings = useCallback(() => {
    //   addDialog({
    //     id: "rpg-res-settings",
    //     component: ({ onClose }) => (
    //       <RpgResourceSettings onClose={onClose} shape={shape} />
    //     ),
    //     onClose: () => {},
    //   });
    // }, [shape]);
    const notation = useMemo(() => {
      const res: string[] = [];
      Object.keys(shape.props.pool).forEach((k) => {
        res.push(`${shape.props.pool[k]}${k}`);
      });
      return res.join("+");
    }, [shape]);

    const shapeFromRoll = (val: RollValue, marker: string, counter: number) => {
      let clr = "var(--color-text)";
      let bkg = "transparent";
      console.log("marker", marker);
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
        case "d4":
          {
            clr = "var(--color-text)";
            bkg = "var(--color-background)";
          }
          break;
      }
      return {
        id: `${shape.id}-roll-${counter}`,
        type: "dice",
        props: {
          background: bkg,
          fill: clr,
          face: Number.parseInt(val.dice.replaceAll("d", "")),
          value: val.value,
          owner: editor.user.getId(),
        },
      } as IDiceShape;
    };

    const clearChildren = () => {
      const tr: TLShapeId[] = [];
      editor.getCurrentPageShapeIds().forEach((id) => {
        if (id.startsWith(`${shape.id}-roll-`)) tr.push(id);
      });
      editor.deleteShapes(tr);
    };

    const insertDice = useCallback(() => {
      clearChildren();
      const msg = rollSingleToChat(notation, false);
      const values = rollValues("white", msg.roll, msg.rollMarkers);
      const dr: Record<string, RollValue[]> = {};
      if (!msg.rollMarkers) return;
      let dy = 10;
      let cnt = 1;
      for (let i = 0; i < msg.rollMarkers!.length; i++) {
        dr[msg.rollMarkers[i]] = values[i];
        let dx = 0;
        values[i].forEach((rv) => {
          const shp = shapeFromRoll(rv, msg.rollMarkers![i], cnt);
          cnt++;
          shp.x = shape.x + dx;
          shp.y = shape.y + shape.props.h + dy;
          editor.createShape(shp);
          dx += 48;
        });
        dy += 48;
      }
      editor.updateShape<IDiceRollerShape>({
        id: shape.id,
        type: "rpg-dice-roller",
        props: {
          roll: dr,
        },
      });
    }, [shape]);

    if (!shape) return <></>;

    return (
      <div
        id={shape.id}
        className={flexColumnStyle({})}
        style={{
          color: shape.props.fill,
          backgroundColor: shape.props.background,
          width: shape.props.w,
          height: shape.props.h,
          alignItems: "center",
          position: "relative",
        }}
      >
        <div>{shape.props.label}</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="currentColor"
            d="M388.53 21.53c-38.006 30.546-63.492 66.122-83.952 103.687 12.746 7.812 25.587 14.923 38.516 21.38l88.744 34.04c13.746 3.8 27.583 6.995 41.51 9.625 13.493-42.908 19.872-85.824 19.433-128.73l-104.25-40zm-266.813 3.88l15.133 64.967 68.95 16.38-12.993-64.525-71.09-16.822zm-17.594 6.848L66.896 79.803l12.358 62.025 39.494-46.785-14.625-62.785zm27.783 76.148l-37.094 43.97 52.165 7.718c7.243-2.11 14.482-4.097 21.716-5.967l27.62-30.408-64.407-15.314zm170.57 37.346l8.776 58.912c5.91 6.06 11.636 12.256 17.13 18.615l89.024 34.157 45.317-50.218c-54.72-11.1-108.31-30.82-160.248-61.468zm-70.09 13.482c-49.324 9.35-98.335 21.9-147.224 42.645 40.825 34.878 76.848 72.364 105.988 113.538l149.204-44.686c-26.533-41.862-66.002-77.02-107.97-111.498zM65.71 209.848C45.093 260.13 28.07 311.115 24.24 367.025c24.535 52.892 70.202 90.623 110.764 119.72l42.476-158.45c-29.975-42.853-68.05-81.942-111.77-118.447zM351.07 287.03L195.39 333.66l-42.146 157.22c52.167-7.854 103.99-21.873 155.822-48.26 24.952-53.52 30.504-99.728 42.002-155.587z"
          />
        </svg>
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="currentColor"
            d="M107.376 28.002c-7.475.147-15.469 2.625-21.11 5.318-12.971 6.287-26.097 18.123-36.622 32.412-10.526 14.29-18.463 30.992-21.854 46.35-3.371 15.272-2.164 28.759 3.705 38.08l89.178 117.861c-.323-1.676-.62-3.362-.877-5.062-4.594-30.313.962-64.488 17.356-95.967 16.393-31.479 40.677-54.6 67.261-66.51 9.26-4.148 18.853-6.918 28.473-8.152l-110.045-60.43c-5.044-2.575-10.19-3.83-15.465-3.9zm138.156 81.95c-11.029-.138-22.48 2.414-33.81 7.49-22.66 10.15-44.375 30.513-59.059 58.708-14.684 28.196-19.4 58.59-15.484 84.428 3.916 25.839 16.127 46.774 35.404 58.152 11.198 6.61 23.703 9.352 36.658 8.504-5.197-12.722-9.295-25.665-9.841-39.318 10.304-19.968 20.802-39.936 35.695-59.905 22.946-7.223 47.124-4.533 75.035-3.39 3.722-16.605 4.335-32.99 2.08-47.863-3.916-25.839-16.127-46.774-35.404-58.153-9.638-5.689-20.244-8.516-31.273-8.654zm71.481 132.306l-67.496 3.863 18.369 61.832 66.26-3.715c-2.435-21.315-10.232-41.558-17.133-61.98zm-80.666 15.195c-7.923 9.763-14.526 20.318-17.787 32.877 1.772 19.22 4.134 38.373 14.185 56.672l18.39-30.13zm173.738 59.95c-24.604 11.259-43.699 23.436-62.822 35.609l70.945 55.69 67.86-48.368c-22.714-15.182-47.656-29.62-75.983-42.932zm-82.357 6.152l-62.108 2.92-18.431 29.722c19.703-.995 38.332.695 59.717-4.502 10.37-9.38 14.824-18.76 20.822-28.14zm14.894 48.601c-5.018 19.188-5.258 39.333-5.73 59.43 17.198 23.68 40.384 36.581 61.943 52.412l8.658-62.232zm142.354 9.223l-58.973 42.498-8.88 56.496c19.434-11.58 37.82-24.417 52.605-41.574 8.266-19.14 11.495-38.28 15.248-57.42z"
          />
        </svg> */}
        <div>{notation}</div>
        {isEditing && (
          <>
            <Button
              type="icon"
              title="Dice pool"
              style={{ position: "absolute", left: -16, top: -40 }}
            >
              <FaDiceD6 size={16} />
            </Button>
            <Button
              type="icon"
              title="Roll"
              onPointerDown={insertDice}
              style={{ position: "absolute", right: -16, top: -40 }}
            >
              <FaPlayCircle size={16} />
            </Button>
            <Button
              type="icon"
              title="Clean dice"
              style={{ position: "absolute", left: -16, bottom: -40 }}
              onPointerDown={clearChildren}
            >
              <FaReplyAll size={16} />
            </Button>
            <Button
              type="icon"
              title="Settings"
              style={{ position: "absolute", right: -16, bottom: -40 }}
            >
              <FaTools size={16} />
            </Button>
          </>
        )}
      </div>
    );
  }
);

export class DiceRollerShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-dice-roller";
  static override initial = "idle";
  override shapeType = "rpg-dice-roller";

  override onDoubleClick: TLClickEvent = (_info) => {};
}

export const rpgDiceShapeProps: ShapeProps<IDiceRollerShape> = {
  w: T.number,
  h: T.number,
  fill: T.string,
  background: T.string,
  owner: T.string,
  pool: T.dict(T.string, T.number),
  roll: T.dict(T.string, T.arrayOf<RollValue>(T.any)),
  label: T.string,
};

export class DiceRollerShapeUtil extends BaseBoxShapeUtil<IDiceRollerShape> {
  static override type = "rpg-dice-roller" as const;
  static override props = rpgDiceShapeProps;

  override canResize = (_shape: IDiceRollerShape) => true;
  override canEditInReadOnly = () => false;
  override canEdit: TLShapeUtilFlag<IDiceRollerShape> = () => true;

  getDefaultProps(): IDiceRollerShape["props"] {
    return {
      w: 70,
      h: 90,
      fill: "var(--color-text)",
      background: "transparent",
      owner: "",
      pool: { dTl: 2, dTd: 2, d4: 2 },
      roll: {},
      label: "Dice roller",
    };
  }

  getGeometry(shape: IDiceRollerShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: IDiceRollerShape) {
    const bounds = this.editor.getShapeGeometry(shape).bounds;
    return <DiceRollerComponent bounds={bounds} shape={shape} key={shape.id} />;
  }

  indicator(shape: IDiceRollerShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override onResize: TLOnResizeHandler<IDiceRollerShape> = (shape, info) => {
    return resizeBox(shape, info);
  };

  override onBeforeCreate: TLOnBeforeCreateHandler<IDiceRollerShape> = (
    next
  ) => {
    return {
      ...next,
      props: { ...next.props, owner: this.editor.user.getId() },
    };
  };
}
