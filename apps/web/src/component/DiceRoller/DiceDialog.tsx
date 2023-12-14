import {
  Button,
  Dialog,
  Input,
  TLUiDialogProps,
  getDefaultColorTheme,
  getUserPreferences,
  useEditor,
} from "@tldraw/tldraw";
import React, { useState } from "react";
import { flexColumnStyle, flexRowStyle } from "../../common";
import { useChat, useRoll } from "../../hooks";
import { FaUserSecret } from "react-icons/fa";

type Props = TLUiDialogProps & {
  notation: string;
  private: boolean;
  hasComment: boolean;
  hasMod: boolean;
  isCustom: boolean;
};

export const DiceDialog = (props: Props) => {
  const [mod, setMod] = useState("");
  const [ntn, setNtn] = useState("");
  const [comment, setComment] = useState("");
  const editor = useEditor();
  const user = getUserPreferences();
  const theme = getDefaultColorTheme({
    isDarkMode: editor.user.getIsDarkMode(),
  });
  const { rollSingleToChat } = useRoll(user, theme);
  const { addChatMessage } = useChat(editor);

  const roll = () => {
    let n = props.isCustom ? ntn : props.notation;
    if (n.trim() === "") return;
    if (props.hasMod && mod.trim() !== "") {
      const num = Number.parseInt(mod);
      if (num !== Number.NaN) n = num > 0 ? `${n}+${num}` : `${n}${num}`;
    }
    let c = undefined;
    if (props.hasComment) c = comment;
    const msg = rollSingleToChat(n, props.private, c);
    addChatMessage(msg);
    props.onClose();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>
          <div className={flexRowStyle({})}>
            {props.private && <FaUserSecret fill="var(--color-accent)" />}
            Roll {props.notation}
          </div>
        </Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        <div className={flexColumnStyle({})}>
          {props.isCustom && (
            <Input
              className="tlui-embed-dialog__input"
              placeholder="Custom dice notation"
              autofocus
              onValueChange={(value) => {
                setNtn(value);
              }}
            />
          )}
          {props.hasMod && (
            <Input
              className="tlui-embed-dialog__input"
              placeholder="Roll modifier value"
              autofocus
              onValueChange={(value) => {
                setMod(value);
              }}
            />
          )}
          {props.hasComment && (
            <Input
              className="tlui-embed-dialog__input"
              placeholder="Roll comment"
              autofocus
              onValueChange={(value) => {
                setComment(value);
              }}
            />
          )}
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button onPointerDown={roll} type="normal">
            Roll
          </Button>
        </div>
      </Dialog.Footer>
    </>
  );
};
