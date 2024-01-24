import React, { useCallback, useMemo, useState } from "react";
import { customSettingsRootStyle } from "./style.css";
import { useAtomValue } from "jotai";
import {
  compactColors,
  customSettingsVisible,
  selectedCustomShape,
} from "../../common";
import {
  TLBaseShape,
  TLShapePartial,
  stopEventPropagation,
  track,
  useEditor,
} from "@tldraw/tldraw";
import { Compact } from "@uiw/react-color";

export const CsColor = track(({ shape }: { shape: TLBaseShape<any, any> }) => {
  const editor = useEditor();

  const value = useMemo(() => {
    console.log("value");
    return shape ? shape.props.color : "#ffffff";
  }, [shape]);

  const change = useCallback(
    (val: string) => {
      const shapeUpdate: TLShapePartial<any> = {
        id: shape.id,
        type: shape.type,
        props: {
          color: val,
        },
      };
      editor.updateShapes([shapeUpdate]);
    },
    [shape]
  );

  return (
    <>
      <div>Color</div>
      <Compact
        colors={compactColors}
        data-color-mode={editor.user.getIsDarkMode() ? "dark" : undefined}
        style={{ width: "180px" }}
        color={value}
        onChange={(color) => change(color.hex)}
      />
    </>
  );
});

export const CustomSettings = () => {
  const visible = useAtomValue(customSettingsVisible);
  const shapeId = useAtomValue(selectedCustomShape);
  const editor = useEditor();

  const shape = useMemo(
    () => (shapeId ? editor.getShape(shapeId) : null),
    [shapeId]
  );

  const component = useMemo(() => {
    if (!shape) return null;
    console.log("comp");
    const util = editor.getShapeUtil(shape) as any;
    return util.settingsComponent(shape);
  }, [shape]);

  if (!visible) return null;

  return (
    <div
      className={customSettingsRootStyle}
      onWheelCapture={stopEventPropagation}
      onPointerDown={stopEventPropagation}
      onPointerUp={stopEventPropagation}
    >
      {component}
    </div>
  );
};
