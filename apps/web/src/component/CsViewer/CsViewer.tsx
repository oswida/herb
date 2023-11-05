import { useAtomValue } from "jotai";
import { csheetVisible, uiVisible } from "../../common/state";
import { useEffect } from "react";
import { hideStylePanel } from "../../common/utils";

export const CsViewer = () => {
  const visible = useAtomValue(csheetVisible);
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
          id="csviewer"
          className="tlui-style-panel tlui-style-panel__wrapper"
          style={{
            position: "absolute",
            right: "10px",
            top: "100px",
            width: "100px",
            height: "100px",
          }}
        >
          CsViewer
        </div>
      )}
    </>
  );
};
