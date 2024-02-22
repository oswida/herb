import React, { useCallback, useMemo } from "react";
import { diceRollerItemStyle } from "./style.css";
import { ChatMsg, flexRowStyle } from "../../common";
import { FaUserSecret } from "react-icons/fa";
import { TLInstancePresence, useEditor } from "@tldraw/tldraw";
import { useChat } from "../../hooks";
import { RollResultItem } from "./RollResultItem";

type Props = {
  item: ChatMsg;
  users: Record<string, TLInstancePresence>;
};

export const DiceRollerItem = (props: Props) => {
  const editor = useEditor();
  const { updateChatMessage } = useChat(editor);

  const reveal = () => {
    props.item.priv = false;
    updateChatMessage(props.item);
  };

  const userColor = useCallback(
    (id: string) => {
      if (!props.users || !props.users[id]) return "var(--color-text)";
      return props.users[id].color;
    },
    [props.users]
  );

  return (
    <div className={diceRollerItemStyle} key={props.item.id}>
      <div className={flexRowStyle({ justify: "space" })}>
        <div style={{ color: `${userColor(props.item.userId)}` }}>
          {props.item.userName}
        </div>
        <div className={flexRowStyle({})} style={{ gap: "10px" }}>
          {props.item.tstamp}
          {props.item.priv && (
            <div className={flexRowStyle({ justify: "end" })}>
              <FaUserSecret
                fill="var(--color-accent)"
                title="Reveal private roll"
                onPointerDown={reveal}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
        </div>
      </div>
      <RollResultItem roll={props.item.roll} markers={props.item.rollMarkers} />

      <div
        className={flexRowStyle({ justify: "space" })}
        style={{
          alignItems: "end",
          borderTop: "solid 1px var(--color-text-3)",
          display: !props.item.comment ? "none" : undefined,
        }}
      >
        {props.item.comment && (
          <i
            style={{
              color: "var(--color-grid)",
              fontSize: "12px",
              marginTop: "5px",
              whiteSpace: "pre-wrap",
            }}
          >
            {props.item.comment}
          </i>
        )}
      </div>
    </div>
  );
};
