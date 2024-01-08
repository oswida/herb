import {
  BaseBoxShapeUtil,
  Box2d,
  Button,
  Rectangle2d,
  ShapeProps,
  T,
  TLBaseShape,
  TLOnBeforeCreateHandler,
  TLOnResizeHandler,
  TLShapeId,
  TLShapePartial,
  TLShapeUtilFlag,
  resizeBox,
  track,
  useDialogs,
  useEditor,
  useIsEditing,
} from "@tldraw/tldraw";
import React from "react";
import { flexColumnStyle } from "../common";
import { CardDrawIcon, CardShuffleIcon } from "../component/Icons";
import { FaReply } from "react-icons/fa";
import { Confirmation } from "../component/Confirmation";
import { ICardStackShape } from "./CardStackShape";

export type ICardShape = TLBaseShape<
  "card",
  {
    w: number;
    h: number;
    owner: string;
    private: boolean;
    url: string;
    bkgUrl: string;
    flipped: boolean;
    stack: TLShapeId | undefined;
    aid?: string;
  }
>;

type CardComponentProps = {
  shape: ICardShape;
  bounds: Box2d;
};

export const CardComponent = track(({ shape, bounds }: CardComponentProps) => {
  const isEditing = useIsEditing(shape.id);
  const editor = useEditor();
  const { addDialog } = useDialogs();

  if (!shape) return <></>;

  const shuffle = () => {
    addDialog({
      component: ({ onClose }) => (
        <Confirmation
          onClose={onClose}
          title="Return to stack"
          message="Return card to stack?"
          callback={() => {
            if (!shape.props.stack) return;
            const parent = editor.getShape(
              shape.props.stack
            ) as ICardStackShape;
            if (!parent) return;
            const asset = parent.props.pool.find(
              (it) => it.id === shape.props.aid
            );
            if (!asset) return;
            const items = [...parent.props.current, asset];
            const shapeUpdate: TLShapePartial<ICardStackShape> = {
              id: parent.id,
              type: "rpg-card-stack",
              props: {
                current: [...items],
              },
            };
            editor.updateShapes([shapeUpdate]);
            editor.deleteShape(shape.id);
          }}
        />
      ),
      onClose: () => {},
    });
  };

  const flip = () => {
    const shapeUpdate: TLShapePartial<ICardShape> = {
      id: shape.id,
      type: "card",
      props: {
        flipped: !shape.props.flipped,
      },
    };
    editor.updateShapes([shapeUpdate]);
  };

  return (
    <div
      id={shape.id}
      className={flexColumnStyle({})}
      style={{
        width: shape.props.w,
        height: shape.props.h,
        alignItems: "center",
        position: "relative",
      }}
    >
      <img
        src={shape.props.flipped ? shape.props.bkgUrl : shape.props.url}
        style={{ width: shape.props.w, height: shape.props.h }}
      />
      {isEditing && (
        <>
          <Button
            type="icon"
            title="Shuffle to stack"
            style={{ position: "absolute", left: -40, bottom: 0 }}
            onPointerDown={shuffle}
          >
            <CardShuffleIcon size="24" />
          </Button>
          <Button
            type="icon"
            title="Flip"
            style={{ position: "absolute", right: -40, bottom: 0 }}
            onPointerDown={flip}
          >
            <FaReply size={16} />
          </Button>
        </>
      )}
    </div>
  );
});

export const rpgCardShapeProps: ShapeProps<ICardShape> = {
  w: T.number,
  h: T.number,
  owner: T.string,
  bkgUrl: T.string,
  url: T.string,
  private: T.boolean,
  flipped: T.boolean,
  stack: T.any,
  aid: T.string,
};

export class CardShapeUtil extends BaseBoxShapeUtil<ICardShape> {
  static override type = "card" as const;
  static override props = rpgCardShapeProps;

  override canResize = (_shape: ICardShape) => true;
  override canEditInReadOnly = () => false;
  override canEdit: TLShapeUtilFlag<ICardShape> = () => true;

  getDefaultProps(): ICardShape["props"] {
    return {
      w: 40,
      h: 40,
      owner: "",
      bkgUrl: "",
      private: false,
      url: "",
      flipped: false,
      stack: undefined,
      aid: "",
    };
  }

  getGeometry(shape: ICardShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape: ICardShape) {
    const bounds = this.editor.getShapeGeometry(shape).bounds;
    return <CardComponent bounds={bounds} shape={shape} key={shape.id} />;
  }

  indicator(shape: ICardShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }

  override onResize: TLOnResizeHandler<ICardStackShape> = (shape, info) => {
    return resizeBox(shape, info);
  };

  override onBeforeCreate: TLOnBeforeCreateHandler<ICardShape> = (next) => {
    return {
      ...next,
      props: { ...next.props, owner: this.editor.user.getId() },
    };
  };
}
