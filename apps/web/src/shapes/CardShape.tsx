import {
  BaseBoxShapeTool,
  Button,
  ShapeProps,
  T,
  TLBaseShape,
  TLShapeId,
  TLShapePartial,
  getDefaultColorTheme,
  track,
  useDefaultHelpers,
  useEditor,
} from "@tldraw/tldraw";
import React from "react";
import { flexColumnStyle, flexRowStyle, shuffleArray } from "../common";
import { FaReply } from "react-icons/fa";
import { Confirmation } from "../component/Confirmation";
import {
  IconStackFront,
  IconStackBack,
  IconStackMiddle,
} from "@tabler/icons-react";
import { CustomShapeUtil } from "./CustomShape";
import { RpgCardStackShape } from "./CardStackShape";

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
};

const RpgCardMain = track(({ shape }: { shape: RpgCardShape }) => {
  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={shape.props._flipped ? shape.props._bkgUrl : shape.props._url}
        style={{ width: shape.props.w, height: shape.props.h }}
      />
    </div>
  );
});

const RpgCardActions = ({ shape }: { shape: RpgCardShape }) => {
  const editor = useEditor();
  const { addDialog } = useDefaultHelpers();

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
    </div>
  );
};

export class RpgCardShapeUtil extends CustomShapeUtil<RpgCardShape> {
  static override type = "rpg-card" as const;
  static override props = shapeProps;
  override actionsCount = 4;

  override getDefaultProps(): RpgCardShape["props"] {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });
    return {
      w: 150,
      h: 150,
      _bkgUrl: "",
      _flipped: false,
      _stack: undefined,
      _url: "",
      _aid: "",
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
