import React, { ComponentProps, useCallback, useMemo, useState } from "react";
import { customSettingsRootStyle } from "./style.css";
import { useAtomValue } from "jotai";
import {
  compactColors,
  customSettingsVisible,
  flexRowStyle,
  selectedCustomShape,
} from "../../common";
import {
  Button,
  DropdownMenu,
  Input,
  TLBaseShape,
  TLShapePartial,
  stopEventPropagation,
  track,
  useEditor,
} from "@tldraw/tldraw";
import { Compact } from "@uiw/react-color";
import { CheckItem } from "../CheckItem";

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
      {vtype !== "boolean" && <div>{title}</div>}
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
      {vtype === "boolean" && (
        <CheckItem checked={value as boolean} label={title} setValue={change} />
      )}
    </div>
  );
};

type CsSelectProps = {
  shape: TLBaseShape<any, any>;
  field: string;
  title: string;
  dict: Record<string, any>;
};

export const CsIconSelect = ({
  field,
  shape,
  title,
  dict,
  ...rest
}: CsSelectProps & ComponentProps<"div">) => {
  const editor = useEditor();
  const [value, setValue] = useState<string>(shape ? shape.props[field] : null);

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
    <div {...rest}>
      <div>{title}</div>
      <div className={flexRowStyle({})} style={{ flexWrap: "wrap" }}>
        {Object.keys(dict).map((it) => (
          <Button
            key={it}
            type="icon"
            data-state={it === value ? "hinted" : undefined}
            onPointerDown={() => change(it)}
          >
            {dict[it]}
          </Button>
        ))}
      </div>
    </div>
  );
};

type CsFontSelectProps = {
  shape: TLBaseShape<any, any>;
  field: string;
  title: string;
};

export const CsFontSelect = ({
  field,
  shape,
  title,
  ...rest
}: CsFontSelectProps & ComponentProps<"div">) => {
  const editor = useEditor();
  const [value, setValue] = useState<string>(shape ? shape.props[field] : null);

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
    <div {...rest}>
      <div>{title}</div>
      <div className={flexRowStyle({})} style={{ flexWrap: "wrap" }}>
        <Button
          type="icon"
          icon="font-draw"
          data-state={value === "draw" ? "hinted" : undefined}
          onPointerDown={() => change("draw")}
        />
        <Button
          type="icon"
          icon="font-sans"
          data-state={value === "sans" ? "hinted" : undefined}
          onPointerDown={() => change("sans")}
        />
        <Button
          type="icon"
          icon="font-serif"
          data-state={value === "serif" ? "hinted" : undefined}
          onPointerDown={() => change("serif")}
        />
        <Button
          type="icon"
          icon="font-mono"
          data-state={value === "mono" ? "hinted" : undefined}
          onPointerDown={() => change("mono")}
        />
      </div>
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

  const Component = () => {
    if (!shape) return null;
    const util = editor.getShapeUtil(shape) as any;
    const comp = util.settingsComponent(shape);
    if (!comp) return comp;

    return (
      <div
        className={customSettingsRootStyle}
        onWheelCapture={stopEventPropagation}
        onPointerDown={stopEventPropagation}
        onPointerUp={stopEventPropagation}
      >
        {comp}
      </div>
    );
  };

  if (!visible) return null;

  return <Component />;
};
