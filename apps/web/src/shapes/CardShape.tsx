import {
  BaseBoxShapeTool,
  Button,
  ShapeProps,
  T,
  TLBaseShape,
  TLShapeId,
  TLShapePartial,
  TLShapeUtilFlag,
  track,
  useDefaultHelpers,
  useEditor,
} from "@tldraw/tldraw";
import React, { useMemo } from "react";
import { flexColumnStyle, flexRowStyle, shuffleArray } from "../common";
import { FaRegEye, FaRegEyeSlash, FaReply } from "react-icons/fa";
import { Confirmation } from "../component/Confirmation";
import {
  IconStackFront,
  IconStackBack,
  IconStackMiddle,
} from "@tabler/icons-react";
import { CustomShapeUtil } from "./CustomShape";
import { RpgCardStackShape } from "./RpgCardStackShape";

export type RpgCardShape = TLBaseShape<
  "rpg-card",
  {
    w: number;
    h: number;
    _url: string;
    _bkgUrl: string;
    _flipped: boolean;
    _stack: TLShapeId | undefined;
    _aid?: string;
    owner: string;
    private: boolean;
    revealed: boolean;
  }
>;

export class RpgCardShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-card";
  override shapeType = "rpg-card";
  static override initial = "idle";
}

const shapeProps: ShapeProps<RpgCardShape> = {
  w: T.number,
  h: T.number,
  _url: T.string,
  _bkgUrl: T.string,
  _flipped: T.boolean,
  _stack: T.any,
  _aid: T.string,
  owner: T.string,
  private: T.boolean,
  revealed: T.boolean,
};

const RpgCardMain = track(({ shape }: { shape: RpgCardShape }) => {
  const editor = useEditor();
  const isOwner = useMemo(() => {
    return shape.props.owner === editor.user.getId();
  }, [shape]);

  const shown = useMemo(() => {
    if (isOwner || !shape.props.private) return true;
    if (shape.props.private && shape.props.revealed) return true;
    return false;
  }, [isOwner, shape.props.private, shape.props.revealed]);

  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {shown && (
        <img
          src={shape.props._flipped ? shape.props._bkgUrl : shape.props._url}
          style={{
            width: shape.props.w,
            height: shape.props.h,
            borderRadius: 10,
          }}
        />
      )}
      {!shown && (
        <img
          src={shape.props._bkgUrl}
          style={{
            width: shape.props.w,
            height: shape.props.h,
            borderRadius: 10,
          }}
        />
      )}
    </div>
  );
});

const RpgCardActions = ({ shape }: { shape: RpgCardShape }) => {
  const editor = useEditor();
  const { addDialog } = useDefaultHelpers();
  const isOwner = useMemo(() => {
    return shape.props.owner === editor.user.getId();
  }, [shape]);

  const move = (action: string) => {
    let title = "";
    let message = "";
    switch (action) {
      case "top":
        title = "Put on top";
        message = "Put card on top of stack?";
        break;
      case "bottom":
        title = "Put to bottom";
        message = "Put card to bottom of stack?";
        break;
      default:
        title = "Shuffle to stack";
        message = "Shuffle card to stack?";
    }
    addDialog({
      component: ({ onClose }) => (
        <Confirmation
          onClose={onClose}
          title={title}
          message={message}
          callback={() => {
            if (!shape.props._stack) return;
            const parent = editor.getShape(
              shape.props._stack
            ) as RpgCardStackShape;
            if (!parent) return;
            const asset = parent.props._pool.find(
              (it) => it.id === shape.props._aid
            );
            if (!asset) return;
            const items = [...parent.props._current];
            switch (action) {
              case "top":
                items.unshift(asset);
                break;
              default:
                items.push(asset);
            }
            const shapeUpdate: TLShapePartial<RpgCardStackShape> = {
              id: parent.id,
              type: "rpg-card-stack",
              props: {
                _current: action === "shuffle" ? shuffleArray(items) : items,
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
    const shapeUpdate: TLShapePartial<RpgCardShape> = {
      id: shape.id,
      type: "rpg-card",
      props: {
        _flipped: !shape.props._flipped,
      },
    };
    editor.updateShapes([shapeUpdate]);
  };

  const reveal = () => {
    const shapeUpdate: TLShapePartial<RpgCardShape> = {
      id: shape.id,
      type: "rpg-card",
      props: {
        revealed: !shape.props.revealed,
      },
    };
    editor.updateShapes([shapeUpdate]);
  };

  if (!isOwner && shape.props.private) return null;

  return (
    <div
      className={flexRowStyle({ justify: "center" })}
      style={{ flexWrap: "nowrap", gap: "2px" }}
    >
      <Button
        type="icon"
        title="Put card on top of stack"
        onPointerDown={() => move("top")}
      >
        <IconStackFront size={24} />
      </Button>
      <Button
        type="icon"
        title="Put card on bottom of stack"
        onPointerDown={() => move("bottom")}
      >
        <IconStackBack size={24} />
      </Button>
      <Button
        type="icon"
        title="Shuffle to stack"
        onPointerDown={() => move("shuffle")}
      >
        <IconStackMiddle size={24} />
      </Button>
      <Button type="icon" title="Flip" onPointerDown={flip}>
        <FaReply size={16} />
      </Button>
      {shape.props.private && (
        <>
          {!shape.props.revealed && (
            <Button type="icon" title="Reveal" onPointerDown={reveal}>
              <FaRegEyeSlash size={16} fill="var(--color-accent)" />
            </Button>
          )}
          {shape.props.revealed && (
            <Button type="icon" title="Hide" onPointerDown={reveal}>
              <FaRegEye size={16} />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export class RpgCardShapeUtil extends CustomShapeUtil<RpgCardShape> {
  static override type = "rpg-card" as const;
  static override props = shapeProps;
  override isAspectRatioLocked: TLShapeUtilFlag<RpgCardShape> = () => true;
  override actionsCount = 5;

  override getDefaultProps(): RpgCardShape["props"] {
    return {
      w: 150,
      h: 150,
      _bkgUrl: "",
      _flipped: false,
      _stack: undefined,
      _url: "",
      _aid: "",
      owner: "",
      private: false,
      revealed: false,
    };
  }

  override settingsComponent(shape: RpgCardShape): React.JSX.Element | null {
    return null;
  }

  override mainComponent(shape: RpgCardShape): React.JSX.Element | null {
    return <RpgCardMain shape={shape} />;
  }

  override actionComponent(shape: RpgCardShape): React.JSX.Element | null {
    return <RpgCardActions shape={shape} />;
  }
}
