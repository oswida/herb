import React, { ComponentProps, useCallback, useMemo, useState } from "react";
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
  useEditor,
} from "@tldraw/tldraw";
import { Compact } from "@uiw/react-color";

type CsProps = {
  shape: TLBaseShape<any, any>;
  field: string;
  title: string;
  vtype: "string" | "boolean" | "number" | "color";
};

export const CsField = ({
  field,
  shape,
  title,
  vtype,
  ...rest
}: CsProps & ComponentProps<"div">) => {
  const editor = useEditor();
  const [value, setValue] = useState<string | number | boolean | null>(
    shape ? shape.props[field] : null
  );

  const change = useCallback(
    (val: string | number | boolean | null) => {
      let result: any = val;
      if (vtype === "number") {
        const num = Number.parseInt(result);
        if (!Number.isNaN(num)) result = num;
        else result = 1;
      }
      const shapeUpdate: TLShapePartial<any> = {
        id: shape.id,
        type: shape.type,
        props: {
          [field]: result,
        },
      };
      editor.updateShapes([shapeUpdate]);
      setValue(val);
    },
    [shape]
  );

  return (
    <div {...rest}>
      <div>{title}</div>
      {vtype === "string" && (
        <Input
          className="tlui-embed-dialog__input"
          placeholder={field}
          defaultValue={`${shape.props[field]}`}
          onValueChange={change}
        />
      )}
      {vtype === "number" && (
        <Input
          className="tlui-embed-dialog__input"
          placeholder={field}
          defaultValue={`${shape.props[field]}`}
          onValueChange={change}
        />
      )}
      {vtype === "color" && (
        <Compact
          colors={compactColors}
          data-color-mode={editor.user.getIsDarkMode() ? "dark" : undefined}
          style={{ width: "180px" }}
          color={value as string}
          onChange={(color) => change(color.hex)}
        />
      )}
    </div>
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
