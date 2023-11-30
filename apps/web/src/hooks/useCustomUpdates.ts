import { Editor, TLRecord } from "@tldraw/tldraw";
import { IMarkdownShape, MarkdownShapeUtil } from "../shapes";
import { ITimerShape, TimerShapeUtil } from "../shapes/TimerShape";
import { useCallback } from "react";

export const useCustomUpdates = (editor: Editor | undefined) => {
  const updateCustomShapes = useCallback(
    (_prev: TLRecord, next: TLRecord, source: "remote" | "user") => {
      if (!editor) return;
      if (next.typeName !== "shape" || source !== "remote") return;
      switch (next.type) {
        case "timer":
          {
            const shape = editor.getShape(next.id) as ITimerShape;
            if (!shape) return;
            const util = editor.getShapeUtil<ITimerShape>(
              shape
            ) as TimerShapeUtil;
            util.updateProps(shape, true);
          }
          break;
        case "markdown":
          {
            const shape = editor.getShape(next.id) as IMarkdownShape;
            if (!shape) return;
            const util = editor.getShapeUtil<IMarkdownShape>(
              shape
            ) as MarkdownShapeUtil;
            util.updateProps(shape);
          }
          break;
      }
    },
    [editor]
  );

  return { updateCustomShapes };
};
