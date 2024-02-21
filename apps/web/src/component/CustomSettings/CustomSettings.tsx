import React, { ComponentProps, useCallback, useMemo, useState } from "react";
import { customSettingsRootStyle } from "./style.css";
import { useAtom, useAtomValue } from "jotai";
import {
  compactColors,
  customSettingsVisible,
  flexRowStyle,
  selectedCustomShape,
  uiVisible,
} from "../../common";
import {
  TLBaseShape,
  TLShapePartial,
  TldrawUiButton,
  TldrawUiButtonIcon,
  TldrawUiIcon,
  TldrawUiInput,
  getDefaultColorTheme,
  stopEventPropagation,
  track,
  useEditor,
} from "@tldraw/tldraw";
import { Compact } from "@uiw/react-color";
import { CheckItem } from "../CheckItem";
import { PiCubeTransparent } from "react-icons/pi";
import { MdOutlineColorLens } from "react-icons/md";

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
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });

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
        <TldrawUiInput
          className="tlui-embed-dialog__input"
          placeholder={field}
          defaultValue={`${shape.props[field]}`}
          onValueChange={change}
        />
      )}
      {vtype === "number" && (
        <TldrawUiInput
          className="tlui-embed-dialog__input"
          placeholder={field}
          defaultValue={`${shape.props[field]}`}
          onValueChange={change}
        />
      )}
      {vtype === "color" && (
        <>
          <Compact
            colors={[
              ...compactColors,
              "var(--color-text)",
              "var(--color-background)",
            ]}
            data-color-mode={editor.user.getIsDarkMode() ? "dark" : undefined}
            style={{ width: "180px" }}
            color={value as string}
            onChange={(color) => change(color.hex)}
          />
        </>
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
          <TldrawUiButton
            key={it}
            type="icon"
            data-state={it === value ? "hinted" : undefined}
            onPointerDown={() => change(it)}
          >
            {dict[it]}
          </TldrawUiButton>
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
      <div className={flexRowStyle({})} style={{ flexWrap: "wrap", gap: 2 }}>
        <TldrawUiButton
          type="icon"
          data-state={value === "draw" ? "hinted" : undefined}
          onPointerDown={() => change("draw")}
        >
          <TldrawUiIcon icon="font-draw" />
        </TldrawUiButton>
        <TldrawUiButton
          type="icon"
          data-state={value === "sans" ? "hinted" : undefined}
          onPointerDown={() => change("sans")}
        >
          <TldrawUiIcon icon="font-sans" />
        </TldrawUiButton>
        <TldrawUiButton
          type="icon"
          data-state={value === "serif" ? "hinted" : undefined}
          onPointerDown={() => change("serif")}
        >
          <TldrawUiIcon icon="font-serif" />
        </TldrawUiButton>
        <TldrawUiButton
          type="icon"
          data-state={value === "mono" ? "hinted" : undefined}
          onPointerDown={() => change("mono")}
        >
          <TldrawUiIcon icon="font-mono" />
        </TldrawUiButton>
      </div>
    </div>
  );
};

export const CsResetColors = ({ shape }: { shape: TLBaseShape<any, any> }) => {
  const editor = useEditor();
  const resetColors = useCallback(() => {
    const shapeUpdate: TLShapePartial<any> = {
      id: shape.id,
      type: shape.type,
      props: {
        color: "var(--color-text)",
        background: "var(--color-background)",
      },
    };
    editor.updateShapes([shapeUpdate]);
  }, [shape]);

  const transparent = useCallback(() => {
    const shapeUpdate: TLShapePartial<any> = {
      id: shape.id,
      type: shape.type,
      props: {
        background: "transparent",
      },
    };
    editor.updateShapes([shapeUpdate]);
  }, [shape]);

  return (
    <div className={flexRowStyle({})}>
      <div> Color reset</div>
      <TldrawUiButton
        type="icon"
        onPointerDown={resetColors}
        title="Theme colors"
      >
        <MdOutlineColorLens size={16} />
      </TldrawUiButton>
      <TldrawUiButton
        type="icon"
        onPointerDown={transparent}
        title="Transparent background"
      >
        <PiCubeTransparent size={16} />
      </TldrawUiButton>
    </div>
  );
};

export const CustomSettings = () => {
  const visible = useAtomValue(customSettingsVisible);
  const shapeId = useAtomValue(selectedCustomShape);
  const editor = useEditor();
  const uv = useAtomValue(uiVisible);

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

  if (!visible || !uv) return null;

  return <Component />;
};
