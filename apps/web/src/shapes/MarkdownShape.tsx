import { useQuery } from "@tanstack/react-query";
import {
  BaseBoxShapeUtil,
  Box2d,
  Button,
  Rectangle2d,
  TLBaseShape,
  TLOnBeforeCreateHandler,
  TLOnResizeHandler,
  TLShapePartial,
  TLShapeUtilFlag,
  resizeBox,
  toDomPrecision,
  track,
  useEditor,
  useIsEditing,
} from "@tldraw/tldraw";
import React, { useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaHome, FaUserSecret } from "react-icons/fa";

export type IMarkdownShape = TLBaseShape<
  "markdown",
  {
    w: number;
    h: number;
    url: string | undefined;
    currentUrl: string | undefined;
    color: string;
    fill: string;
    private: boolean;
    owner: string;
  }
>;

interface MarkdownComponentProps {
  shape: IMarkdownShape;
  isEditing: boolean;
  bounds: Box2d;
  baseUrl: string;
}

export const MarkdownComponent = track(
  ({ shape, isEditing, bounds, baseUrl }: MarkdownComponentProps) => {
    const editor = useEditor();

    let url = shape.props.url;
    if (!url) return <div>No url defined</div>;
    if (shape.props.currentUrl && shape.props.currentUrl.trim() !== "")
      url = shape.props.currentUrl;

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
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      structuralSharing: true,
    });

    const open = (name: string | undefined) => {
      if (!name) return;
      const newUrl = `${baseUrl}/handout/${name}`;
      const shapeUpdate: TLShapePartial<IMarkdownShape> = {
        id: shape.id,
        type: "markdown",
        props: {
          currentUrl: newUrl,
        },
      };
      editor.updateShapes([shapeUpdate]);
    };

    const home = () => {
      const shapeUpdate: TLShapePartial<IMarkdownShape> = {
        id: shape.id,
        type: "markdown",
        props: {
          currentUrl: "",
        },
      };
      editor.updateShapes([shapeUpdate]);
    };

    useEffect(() => {
      refetch().then(() => {});
    }, [shape]);

    if (!shape) return <></>;
    if (shape.props.private && shape.props.owner !== editor.user.getId())
      return <></>;

    return (
      <div
        id={shape.id}
        style={{
          width: bounds.width,
          height: bounds.height,
          overflow: "hidden",
          padding: "10px",
          backgroundColor: shape.props.fill,
          color: shape.props.color,
          borderRadius: "5px",
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
        {shape.props.private && (
          <div style={{ position: "absolute", top: 5, right: 5 }}>
            <FaUserSecret size={16} fill="var(--color-accent)" />
          </div>
        )}

        {isEditing && (
          <>
            {shape.props.currentUrl &&
              shape.props.currentUrl !== shape.props.url && (
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
          </>
        )}
      </div>
    );
  }
);

export class MarkdownShapeUtil extends BaseBoxShapeUtil<IMarkdownShape> {
  static override type = "markdown" as const;

  override canEditInReadOnly = () => true;
  override canEdit: TLShapeUtilFlag<IMarkdownShape> = () => true;
  override canResize = (_shape: IMarkdownShape) => true;

  override getDefaultProps(): any {
    return {
      type: "markdown",
      w: 500,
      h: 300,
      url: undefined,
      color: "var(--color-text)",
      background: "transparent",
      private: false,
    };
  }

  getGeometry(shape: IMarkdownShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override component(shape: IMarkdownShape) {
    const isEditing = useIsEditing(shape.id);
    const bounds = this.editor.getShapeGeometry(shape).bounds;
    const UPLOAD_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5001/api/upload`;

    return (
      <MarkdownComponent
        shape={shape}
        isEditing={isEditing}
        bounds={bounds}
        baseUrl={UPLOAD_BASE_URL}
      />
    );
  }

  override indicator(shape: IMarkdownShape) {
    return (
      <rect
        width={toDomPrecision(shape.props.w)}
        height={toDomPrecision(shape.props.h)}
        rx={8}
        ry={8}
      />
    );
  }

  override onResize: TLOnResizeHandler<IMarkdownShape> = (shape, info) => {
    return resizeBox(shape, info);
  };

  override onBeforeCreate: TLOnBeforeCreateHandler<IMarkdownShape> = (next) => {
    return {
      ...next,
      props: { ...next.props, owner: this.editor.user.getId() },
    };
  };
}
