import {
  BaseBoxShapeTool,
  ShapeProps,
  T,
  TLBaseShape,
  getDefaultColorTheme,
  track,
} from "@tldraw/tldraw";
import React from "react";
import { CustomShapeUtil } from "./CustomShape";
import { compactColors, flexColumnStyle } from "../common";
import { Circle, Compact } from "@uiw/react-color";
import { CsColor } from "../component/CustomSettings";

export type RpgAttrShape = TLBaseShape<
  "rpg-attr",
  {
    w: number;
    h: number;
    label: string;
    dice: string;
    color: string;
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
};

const RpgAttrSettings = track(
  ({ shape, darkMode }: { shape: RpgAttrShape; darkMode: boolean }) => {
    return (
      <div className={flexColumnStyle({})} style={{ padding: "5px" }}>
        <CsColor shape={shape} />
      </div>
    );
  }
);

export class RpgAttrShapeUtil extends CustomShapeUtil<RpgAttrShape> {
  static override type = "rpg-attr" as const;
  static override props = shapeProps;

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
    };
  }

  override settingsComponent(shape: RpgAttrShape): React.JSX.Element {
    return (
      <RpgAttrSettings
        shape={shape}
        darkMode={this.editor.user.getIsDarkMode()}
      />
    );
  }

  override mainComponent(shape: RpgAttrShape): React.JSX.Element {
    return <div>main RPG Attr</div>;
  }

  override actionComponent(shape: RpgAttrShape): React.JSX.Element {
    return <div>RPG Attr actions</div>;
  }
}
