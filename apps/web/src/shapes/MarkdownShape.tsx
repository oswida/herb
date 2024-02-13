import { useQuery } from "@tanstack/react-query";
import {
  BaseBoxShapeTool,
  Button,
  ShapeProps,
  T,
  TLBaseShape,
  TLShapePartial,
  getDefaultColorTheme,
  track,
  useEditor,
} from "@tldraw/tldraw";
import React, { useCallback, useEffect, useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaHome } from "react-icons/fa";
import { useAtomValue } from "jotai";
import { flexColumnStyle, flexRowStyle, urlUpload } from "../common";
import { CsField } from "../component/CustomSettings";
import { CustomShapeUtil } from "./CustomShape";

export type MarkdownShape = TLBaseShape<
  "rpg-markdown",
  {
    w: number;
    h: number;
    label: string;
    color: string;
    bkg: string;
    url: string | undefined;
    _currentUrl: string | undefined;
    owner: string;
  }
>;

export class MarkdownShapeTool extends BaseBoxShapeTool {
  static override id = "rpg-markdown";
  override shapeType = "rpg-markdown";
  static override initial = "idle";
}

const shapeProps: ShapeProps<MarkdownShape> = {
  w: T.number,
  h: T.number,
  label: T.string,
  color: T.string,
  bkg: T.string,
  url: T.string,
  _currentUrl: T.string,
  owner: T.string,
};

const MarkdownSettings = track(({ shape }: { shape: MarkdownShape }) => {
  const editor = useEditor();
  const setBkg = () => {
    const shapeUpdate: TLShapePartial<any> = {
      id: shape.id,
      type: shape.type,
      props: {
        bkg: "transparent",
      },
    };
    editor.updateShapes([shapeUpdate]);
  };
  return (
    <div
      className={flexColumnStyle({})}
      style={{ padding: "5px", gap: "10px" }}
    >
      <CsField shape={shape} field="color" title="Color" vtype="color" />
      <CsField shape={shape} field="bkg" title="Background" vtype="color" />
      <CsField shape={shape} field="label" title="Label" vtype="string" />
    </div>
  );
});

const MarkdownMain = track(({ shape }: { shape: MarkdownShape }) => {
  const baseUrl = useAtomValue(urlUpload);
  const editor = useEditor();

  const url = useMemo(() => {
    if (shape.props._currentUrl && shape.props._currentUrl.trim() !== "")
      return shape.props._currentUrl;
    return shape.props.url;
  }, [shape.props._currentUrl, shape.props.url]);

  const { data, refetch } = useQuery({
    queryKey: [shape.id],
    queryFn: async () => {
      const res = await fetch(url!!, {
        method: "GET",
      });
      return await res.text();
    },
    networkMode: "online",
    refetchOnMount: true,
  });

  const open = useCallback(
    (name: string | undefined) => {
      if (!name) return;
      const newUrl = `${baseUrl}/handout/${name}`;
      const shapeUpdate: TLShapePartial<MarkdownShape> = {
        id: shape.id,
        type: "rpg-markdown",
        props: {
          _currentUrl: newUrl,
        },
      };
      editor.updateShapes([shapeUpdate]);
    },
    [baseUrl]
  );

  useEffect(() => {
    refetch().then(() => {});
  }, [shape]);

  if (!url) return <div>No url defined</div>;

  return (
    <div
      className={flexColumnStyle({})}
      style={{
        justifyContent: "center",
        color: shape.props.color,
        backgroundColor: shape.props.bkg,
        alignItems: "center",
        padding: 10,
      }}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (url) => {
            return (
              <Button
                type="normal"
                style={{
                  color: "var(--color-accent)",
                  margin: 0,
                  display: "inline-block",
                }}
                onPointerDown={() => open(url.href)}
              >
                {url.children}
              </Button>
            );
          },
        }}
      >
        {data}
      </Markdown>
    </div>
  );
});

const MarkdownActions = ({ shape }: { shape: MarkdownShape }) => {
  const editor = useEditor();

  const home = () => {
    const shapeUpdate: TLShapePartial<MarkdownShape> = {
      id: shape.id,
      type: "rpg-markdown",
      props: {
        _currentUrl: "",
      },
    };
    editor.updateShapes([shapeUpdate]);
  };

  return (
    <div
      className={flexRowStyle({ justify: "center" })}
      style={{ flexWrap: "nowrap", gap: "2px" }}
    >
      {shape.props._currentUrl !== "" && (
        <Button
          type="icon"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
          }}
          onPointerDown={home}
        >
          <FaHome
            className="markdown-buttons"
            size={16}
            fill={shape.props.color}
          />
        </Button>
      )}
    </div>
  );
};

export class MarkdownShapeUtil extends CustomShapeUtil<MarkdownShape> {
  static override type = "rpg-markdown" as const;
  static override props = shapeProps;
  override actionsCount = 3;

  override getDefaultProps(): MarkdownShape["props"] {
    const theme = getDefaultColorTheme({
      isDarkMode: this.editor.user.getIsDarkMode(),
    });
    return {
      w: 150,
      h: 150,
      label: "",
      color: theme.text,
      bkg: theme.background,
      url: "",
      _currentUrl: "",
      owner: "",
    };
  }

  override settingsComponent(shape: MarkdownShape): React.JSX.Element | null {
    return <MarkdownSettings shape={shape} />;
  }

  override mainComponent(shape: MarkdownShape): React.JSX.Element | null {
    return <MarkdownMain shape={shape} />;
  }

  override actionComponent(shape: MarkdownShape): React.JSX.Element | null {
    return <MarkdownActions shape={shape} />;
  }
}
