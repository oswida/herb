import {
  BaseBoxShapeUtil,
  TLBaseShape,
  TLShapeUtilFlag,
  toDomPrecision,
  useIsEditing,
  useValue,
} from "@tldraw/tldraw";
import React from "react";

export type IPdfShape = TLBaseShape<
  "pdf",
  {
    w: number;
    h: number;
    pdf: string | undefined;
  }
>;

export class PdfShapeUtil extends BaseBoxShapeUtil<IPdfShape> {
  static override type = "pdf" as const;

  override canEditInReadOnly = () => true;
  override canEdit: TLShapeUtilFlag<IPdfShape> = () => true;

  override getDefaultProps(): any {
    return {
      type: "pdf",
      w: 500,
      h: 300,
      pdf: undefined,
    };
  }

  override component(shape: IPdfShape) {
    const isEditing = useIsEditing(shape.id);
    const isHoveringWhileEditingSameShape = useValue(
      "is hovering",
      () => {
        const { editingShapeId, hoveredShapeId } =
          this.editor.getCurrentPageState();

        if (editingShapeId && hoveredShapeId !== editingShapeId) {
          const editingShape = this.editor.getShape(editingShapeId);
          if (
            editingShape &&
            this.editor.isShapeOfType<IPdfShape>(editingShape, "pdf")
          ) {
            return true;
          }
        }

        return false;
      },
      []
    );
    const isInteractive = isEditing || isHoveringWhileEditingSameShape;

    return (
      <object
        data={shape.props.pdf}
        type="application/pdf"
        width={toDomPrecision(shape.props.w)}
        height={toDomPrecision(shape.props.h)}
        className="tl-embed"
        draggable={false}
        style={{
          border: 0,
          pointerEvents: isInteractive ? "auto" : "none",
          // Fix for safari <https://stackoverflow.com/a/49150908>
          zIndex: isInteractive ? "" : "-1",
          borderRadius: 8,
        }}
      ></object>
    );
  }

  override indicator(shape: IPdfShape) {
    return (
      <rect
        width={toDomPrecision(shape.props.w)}
        height={toDomPrecision(shape.props.h)}
        rx={8}
        ry={8}
      />
    );
  }
}
