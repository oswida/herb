import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  Box2d,
  Button,
  Rectangle2d,
  ShapeProps,
  T,
  TLBaseShape,
  TLClickEvent,
  TLOnBeforeCreateHandler,
  TLOnResizeHandler,
  TLShapeId,
  TLShapePartial,
  TLShapeUtilFlag,
  resizeBox,
  track,
  useDefaultHelpers,
  useEditor,
  useIsEditing,
} from "@tldraw/tldraw";
import React, { useCallback } from "react";
import { flexColumnStyle, shuffleArray } from "../common";
import { FaReplyAll, FaTools } from "react-icons/fa";
import {
  CardDrawIcon,
  CardPickIcon,
  CardShuffleIcon,
} from "../component/Icons";
import { CardStackSettings } from "./CardStackSettings";
import { CardStackPool } from "./CardStackPool";
import { AssetDesc, useAssets } from "../hooks";
import { Confirmation } from "../component/Confirmation";

export type ICardStackShape = TLBaseShape<
  "rpg-card-stack",
  {
    w: number;
    h: number;
    fill: string;
    background: string;
    owner: string;
    label: string;
    pool: AssetDesc[];
    current: AssetDesc[];
    private: boolean;
    shapeIds: TLShapeId[];
  }
>;

type CardStackComponentProps = {
  shape: ICardStackShape;
  bounds: Box2d;
};

export const CardStackComponent = track(
  ({ shape, bounds }: CardStackComponentProps) => {
    const editor = useEditor();
    const isEditing = useIsEditing(shape.id);
    const { addDialog, addToast } = useDefaultHelpers();
    const { insertAsset } = useAssets(editor, "");

    const selectPool = useCallback(() => {
      addDialog({
        id: "card-stack-pool",
        component: ({ onClose }) => (
          <CardStackPool onClose={onClose} shape={shape} />
        ),
        onClose: () => {},
      });
    }, [shape]);

    const drawCard = () => {
      if (shape.props.current.length === 0) return;
      const items = [...shape.props.current];
      const asset = items.shift();
      if (!asset) return;
      insertAsset(asset).then((id) => {
        if (!id) return;
        const shapeUpdate: TLShapePartial<ICardStackShape> = {
          id: shape.id,
          type: "rpg-card-stack",
          props: {
            current: [...items],
            shapeIds: [...shape.props.shapeIds, id],
          },
        };
        editor.updateShapes([shapeUpdate]);
      });
    };

    const shuffle = () => {
      const items = [...shape.props.current];
      const shapeUpdate: TLShapePartial<ICardStackShape> = {
        id: shape.id,
        type: "rpg-card-stack",
        props: {
          current: shuffleArray(items),
        },
      };
      editor.updateShapes([shapeUpdate]);
      addToast({
        id: "1",
        title: shape.props.label,
        description: "Stack shuffle",
      });
    };

    const reset = () => {
      addDialog({
        component: ({ onClose }) => (
          <Confirmation
            onClose={onClose}
            title="Reset stack"
            message="Are you sure?"
            callback={() => {
              editor.deleteShapes(shape.props.shapeIds);
              const shapeUpdate: TLShapePartial<ICardStackShape> = {
                id: shape.id,
                type: "rpg-card-stack",
                props: {
                  current: shape.props.pool,
                  shapeIds: [],
                },
              };
              editor.updateShapes([shapeUpdate]);
              addToast({
                id: "1",
                title: shape.props.label,
                description: "Stack reset",
              });
            }}
          />
        ),
        onClose: () => {},
      });
    };

    const settings = useCallback(() => {
      addDialog({
        id: "card-stack-settings",
        component: ({ onClose }) => (
          <CardStackSettings onClose={onClose} shape={shape} />
        ),
        onClose: () => {},
      });
    }, [shape]);

    if (!shape) return <></>;

    return (
      <div
        id={shape.id}
        className={flexColumnStyle({})}
        style={{
          color: shape.props.fill,
          width: shape.props.w,
          height: shape.props.h,
          alignItems: "center",
          position: "relative",
        }}
      >
        <div>
          {shape.props.label} ({shape.props.current.length}/
          {shape.props.pool.length})
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="currentColor"
            d="M386.688 487.75l-119.236-55.423c-7.898-3.673-11.334-13.065-7.66-20.976l84.374-181.523c3.667-7.904 13.07-11.334 20.963-7.667l119.24 55.434c7.9 3.673 11.33 13.065 7.656 20.964l-84.37 181.524c-3.678 7.904-13.076 11.334-20.968 7.667zM98.95 467.945L19.79 284.09c-3.448-8.007.255-17.302 8.25-20.744l39.196-16.872 48.975 184.044c4.694 17.588 22.755 28.078 40.36 23.39l39.032-10.386-75.907 32.686c-8.007 3.443-17.296-.255-20.744-8.262zm33.89-41.86L81.362 232.638c-2.24-8.42 2.78-17.078 11.19-19.312l34.033-9.052-4.098 30.465c-2.422 18.036 10.224 34.652 28.285 37.087l79.828 10.758-32.497 109.467c-3.345 11.28-.37 22.948 6.866 31.18l-52.82 14.05c-8.42 2.24-17.07-2.77-19.31-11.196zm108.428-4.76l-16.02-4.76c-8.36-2.49-13.12-11.267-10.644-19.627l56.97-191.9c2.484-8.36 11.28-13.12 19.622-10.65l49.073 14.583.008-.005.12.044-.133-.034c-4.93 3.254-9.04 7.868-11.705 13.605l-84.38 181.53c-2.587 5.586-3.486 11.517-2.915 17.218zm-5.707-155.43l-82.486-11.117c-8.633-1.166-14.704-9.12-13.538-17.758l26.73-198.39c1.16-8.633 9.125-14.698 17.74-13.538l130.327 17.563c8.627 1.166 14.692 9.125 13.532 17.752L311.42 182.46l-15.33-4.552c-17.467-5.197-35.826 4.784-41.004 22.232l-19.525 65.755zm-5.19-31.46c4.67-3.055 7.474-7.438 8.42-13.145.936-5.633-.357-10.617-3.866-14.945-3.51-4.414-8.39-7.14-14.656-8.178-6.344-1.057-11.93-.073-16.75 2.956-4.826 3.03-7.692 7.316-8.615 12.87-.898 5.386.425 10.42 3.97 15.082 3.565 4.504 8.525 7.285 14.863 8.34 6.35 1.057 11.893.062 16.634-2.98zm25.978-81.243c4.693-2.726 8.888-5.434 12.598-8.117 3.703-2.684 6.915-5.586 9.635-8.725 2.72-3.13 4.967-6.573 6.733-10.307 1.76-3.74 3.048-8.032 3.85-12.865 1.262-7.62 1.02-14.358-.735-20.234-1.75-5.87-4.693-10.94-8.833-15.22-4.135-4.27-9.24-7.753-15.318-10.43-6.07-2.684-12.804-4.633-20.174-5.86-7.692-1.28-15.3-1.602-22.815-.977-7.516.614-14.63 2.247-21.346 4.88l-5.95 35.802c6.813-4.25 13.77-7.104 20.855-8.567 7.09-1.475 13.726-1.7 19.913-.668 21.467 4.092 19.44 24.898 8.76 34.03-5.652 4.473-11.334 8.802-15.942 11.345-10.48 5.914-27.69 23.125-22.542 45.145l31.284 5.202c-7.11-17.757 11.663-29.462 20.028-34.434z"
          ></path>
        </svg>

        {isEditing && (
          <>
            <Button
              type="icon"
              title="Card pool"
              onPointerDown={selectPool}
              style={{ position: "absolute", left: -40, top: 0 }}
            >
              <CardPickIcon size="24" />
            </Button>
            <Button
              type="icon"
              title="Draw"
              onPointerDown={drawCard}
              style={{
                position: "absolute",
                right: -40,
                top: 0,
                color: "var(--color-focus)",
              }}
            >
              <CardDrawIcon size="24" />
            </Button>
            <Button
              type="icon"
              title="Shuffle"
              style={{ position: "absolute", left: -40, bottom: 0 }}
              onPointerDown={shuffle}
            >
              <CardShuffleIcon size="24" />
            </Button>
            <Button
              type="icon"
              title="Reset stack"
              style={{ position: "absolute", right: -40, bottom: 0 }}
              onPointerDown={reset}
            >
              <FaReplyAll size={16} />
            </Button>
            <Button
              type="icon"
              title="Settings"
              style={{ position: "absolute", left: "45%", bottom: -40 }}
              onPointerDown={settings}
            >
              <FaTools size={16} />
            </Button>
          </>
        )}
      </div>
    );
  }
);

export class CardStackShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-card-stack";
  static override initial = "idle";
  override shapeType = "rpg-card-stack";

  override onDoubleClick: TLClickEvent = (_info) => {};
}

export const rpgCardStackProps: ShapeProps<ICardStackShape> = {
  w: T.number,
  h: T.number,
  fill: T.string,
  background: T.string,
  owner: T.string,
  pool: T.arrayOf<AssetDesc>(T.any),
  current: T.arrayOf<AssetDesc>(T.any),
  label: T.string,
  private: T.boolean,
  shapeIds: T.arrayOf<TLShapeId>(T.any),
};

export class CardStackShapeUtil extends BaseBoxShapeUtil<ICardStackShape> {
  static override type = "rpg-card-stack" as const;
  static override props = rpgCardStackProps;

  override canResize = (_shape: ICardStackShape) => true;
  override canEditInReadOnly = () => false;
  override canEdit: TLShapeUtilFlag<ICardStackShape> = () => true;

  getDefaultProps(): ICardStackShape["props"] {
    return {
      w: 70,
      h: 90,
      fill: "var(--color-text)",
      background: "transparent",
      owner: "",
      pool: [],
      current: [],
      label: "Card stack",
      private: false,
      shapeIds: [],
    };
  }

  getGeometry(shape: ICardStackShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: ICardStackShape) {
    const bounds = this.editor.getShapeGeometry(shape).bounds;
    return <CardStackComponent bounds={bounds} shape={shape} key={shape.id} />;
  }

  indicator(shape: ICardStackShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override onResize: TLOnResizeHandler<ICardStackShape> = (shape, info) => {
    return resizeBox(shape, info);
  };

  override onBeforeCreate: TLOnBeforeCreateHandler<ICardStackShape> = (
    next
  ) => {
    return {
      ...next,
      props: { ...next.props, owner: this.editor.user.getId() },
    };
  };
}
