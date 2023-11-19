import { useQuery } from "@tanstack/react-query";
import {
  BaseBoxShapeUtil,
  Box2d,
  Button,
  Rectangle2d,
  TLBaseShape,
  TLOnResizeHandler,
  TLShapePartial,
  TLShapeUtilFlag,
  resizeBox,
  toDomPrecision,
  useDialogs,
  useEditor,
  useIsEditing,
} from "@tldraw/tldraw";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaHome, FaTools } from "react-icons/fa";
import { MarkdownSettings } from "./MarkdownSettings";
import { UPLOAD_BASE_URL } from "../common";

export type IMarkdownShape = TLBaseShape<
  "markdown",
  {
    w: number;
    h: number;
    url: string | undefined;
    currentUrl: string | undefined;
    color: string;
    background: string;
  }
>;

export const MarkdownComponent = ({
  origin,
  isEditing,
  bounds,
}: {
  origin: IMarkdownShape;
  isEditing: boolean;
  bounds: Box2d;
}) => {
  const editor = useEditor();
  // Using local state for change propagation
  const [shape, setShape] = useState<IMarkdownShape>(origin);
  if (!shape) return <>No shape</>;

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
  const { addDialog } = useDialogs();

  const open = (name: string | undefined) => {
    if (!name) return;
    const newUrl = `${UPLOAD_BASE_URL}/handout/${name}`;
    const shapeUpdate: TLShapePartial<IMarkdownShape> = {
      id: shape.id,
      type: "markdown",
      props: {
        currentUrl: newUrl,
      },
    };
    editor.updateShapes([shapeUpdate]);
    setShape({ ...shape, props: { ...shape.props, currentUrl: newUrl } });
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
    setShape({ ...shape, props: { ...shape.props, currentUrl: "" } });
  };

  useEffect(() => {
    refetch();
  }, [shape]);

  return (
    <div
      style={{
        width: bounds.width,
        height: bounds.height,
        overflow: "hidden",
        padding: "10px",
        backgroundColor: shape.props.background,
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

      {isEditing && (
        <>
          <Button
            type="icon"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
            }}
            onPointerDown={() => {
              addDialog({
                component: ({ onClose }) => (
                  <MarkdownSettings onClose={onClose} shape={shape} />
                ),
                onClose: () => {
                  void null;
                },
              });
            }}
          >
            <FaTools />
          </Button>
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
                <FaHome />
              </Button>
            )}
        </>
      )}
    </div>
  );
};

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
    return (
      <MarkdownComponent origin={shape} isEditing={isEditing} bounds={bounds} />
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
}
