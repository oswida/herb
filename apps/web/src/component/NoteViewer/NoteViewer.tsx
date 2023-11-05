import { useAtomValue } from "jotai";
import { notesVisible, uiVisible } from "../../common/state";
import { useEffect } from "react";
import { hideStylePanel } from "../../common/utils";

export const NoteViewer = () => {
  const visible = useAtomValue(notesVisible);
  const ui = useAtomValue(uiVisible);

  useEffect(() => {
    if (!visible) {
      if (ui) hideStylePanel(false);
      return;
    }
    hideStylePanel(true);
  }, [visible]);

  return (
    <>
      {visible && (
        <div
          id="notesviewer"
          className="tlui-style-panel tlui-style-panel__wrapper"
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            width: "100px",
            height: "60px",
          }}
        >
          NoteViewer
        </div>
      )}
    </>
  );
};
