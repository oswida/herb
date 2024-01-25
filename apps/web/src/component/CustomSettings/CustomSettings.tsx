import React, { useCallback, useMemo, useState } from "react";
import { customSettingsRootStyle } from "./style.css";
import { useAtomValue } from "jotai";
import {
  compactColors,
  customSettingsVisible,
  selectedCustomShape,
} from "../../common";
import {
  Input,
  TLBaseShape,
  TLShapePartial,
  stopEventPropagation,
  track,
  useEditor,
} from "@tldraw/tldraw";
import { Compact } from "@uiw/react-color";

type CsProps = {
  shape: TLBaseShape<any, any>;
  field: string;
  title: string;
};

export const CsInput = ({ shape, field, title }: CsProps) => {
  const editor = useEditor();
  const [value, setValue] = useState<string>(shape ? shape.props[field] : "");

  const change = useCallback(
    (val: string) => {
      const shapeUpdate: TLShapePartial<any> = {
        id: shape.id,
        type: shape.type,
        props: {
          [field]: val,
        },
      };
      editor.updateShapes([shapeUpdate]);
      setValue(val);
    },
    [shape]
  );

  return (
    <>
      <div>{title}</div>
      <Input
        className="tlui-embed-dialog__input"
        placeholder={field}
        defaultValue={`${shape.props[field]}`}
        onValueChange={change}
      />
    </>
  );
};

export const CsColor = ({ shape, field, title }: CsProps) => {
  const editor = useEditor();
  const [value, setValue] = useState<string>(
    shape ? shape.props[field] : "#ffffff"
  );

  const change = useCallback(
    (val: string) => {
      const shapeUpdate: TLShapePartial<any> = {
        id: shape.id,
        type: shape.type,
        props: {
          [field]: val,
        },
      };
      editor.updateShapes([shapeUpdate]);
      setValue(val);
    },
    [shape]
  );

  return (
    <>
      <div>{title}</div>
      <Compact
        colors={compactColors}
        data-color-mode={editor.user.getIsDarkMode() ? "dark" : undefined}
        style={{ width: "180px" }}
        color={value}
        onChange={(color) => change(color.hex)}
      />
    </>
  );
};

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
