import { track, useEditor } from "@tldraw/tldraw";
import { diceRollerVisible } from "../../common/state";
import { useAtomValue } from "jotai";
import {
  diceRollerItemStyle,
  diceRollerListStyle,
  diceRollerRootStyle,
} from "./style.css";
import { useChat } from "../../hooks";
import { DiceRollerSelector } from "./DiceRollerSelector";
import { flexRowStyle } from "../../common";

export const DiceRollerPanel = track(() => {
  const visible = useAtomValue(diceRollerVisible);
  const editor = useEditor();
  const { chatList } = useChat(editor);

  return (
    <>
      {visible && (
        <div id="diceroller" className={diceRollerRootStyle}>
          <div className={diceRollerListStyle}>
            {chatList?.map((it) => (
              <div className={diceRollerItemStyle} key={it.id}>
                <div
                  className={flexRowStyle}
                  style={{ justifyContent: "space-between" }}
                >
                  <div>{it.userName}</div>
                  <div>{it.tstamp}</div>
                </div>
                <span style={{ color: "var(--color-primary)" }}>
                  {it?.roll?.output.split(":")[0]}
                </span>
                {it?.roll?.output.split(":")[1]}
              </div>
            ))}
          </div>
          <div>
            <DiceRollerSelector />
          </div>
        </div>
      )}
    </>
  );
});
