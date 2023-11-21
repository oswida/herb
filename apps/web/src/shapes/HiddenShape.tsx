import {
  BaseBoxShapeUtil,
  Rectangle2d,
  TLBaseShape,
  TLShapeUtilFlag,
} from "@tldraw/tldraw";

export type IHiddenShape = TLBaseShape<
  "hidden",
  {
    w: number;
    h: number;
    meta: any;
  }
>;

export class HiddenShapeUtil extends BaseBoxShapeUtil<IHiddenShape> {
  static override type = "hidden" as const;

  override canEditInReadOnly = () => false;
  override canEdit: TLShapeUtilFlag<IHiddenShape> = () => false;
  override canResize = (_shape: IHiddenShape) => false;

  override getDefaultProps(): any {
    return {
      type: "hidden",
      w: 0,
      h: 0,
      meta: {},
    };
  }

  getGeometry(shape: IHiddenShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override component(shape: IHiddenShape) {
    return null;
  }

  override indicator(shape: IHiddenShape) {
    return null;
  }
}
