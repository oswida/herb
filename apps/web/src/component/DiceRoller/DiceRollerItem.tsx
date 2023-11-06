import React, { forwardRef } from "react";
import { diceRollerItemStyle } from "./style.css";
import { ChatMsg, flexRowStyle } from "../../common";
import { FaUserSecret } from "react-icons/fa";
import { Button, useEditor } from "@tldraw/tldraw";
import { useChat } from "../../hooks";

type Props = {
  item: ChatMsg;
};

export const DiceRollerItem = (props: Props) => {
  const editor = useEditor();
  const { updateChatMessage } = useChat(editor);

  const reveal = () => {
    props.item.priv = false;
    updateChatMessage(props.item);
  };

  return (
    <div className={diceRollerItemStyle} key={props.item.id}>
      <div className={flexRowStyle} style={{ justifyContent: "space-between" }}>
        <div>{props.item.userName}</div>
        <div
          className={flexRowStyle}
          style={{ gap: "10px", alignItems: "center" }}
        >
          {props.item.tstamp}
          {props.item.priv && (
            <div className={flexRowStyle} style={{ justifyContent: "end" }}>
              <FaUserSecret
                fill="var(--color-accent)"
                title="Reveal private roll"
                onClick={reveal}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
        </div>
      </div>
      <span style={{ color: "var(--color-primary)" }}>
        {props.item?.roll?.output.split(":")[0]}
      </span>
      {props.item?.roll?.output.split(":")[1]}
      <div
        className={flexRowStyle}
        style={{
          justifyContent: "space-between",
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
            }}
          >
            {props.item.comment}
          </i>
        )}
      </div>
    </div>
  );
};
