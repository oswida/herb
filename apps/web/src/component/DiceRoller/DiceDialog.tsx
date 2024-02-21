import {
  TLUiDialogProps,
  TldrawUiButton,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogFooter,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  TldrawUiInput,
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
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>
          <div className={flexRowStyle({})}>
            {props.private && <FaUserSecret fill="var(--color-accent)" />}
            Roll {props.notation}
          </div>
        </TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody>
        <div className={flexColumnStyle({})}>
          {props.isCustom && (
            <TldrawUiInput
              className="tlui-embed-dialog__input"
              placeholder="Custom dice notation"
              autofocus
              onValueChange={(value) => {
                setNtn(value);
              }}
            />
          )}
          {props.hasMod && (
            <TldrawUiInput
              className="tlui-embed-dialog__input"
              placeholder="Roll modifier value"
              autofocus
              onValueChange={(value) => {
                setMod(value);
              }}
            />
          )}
          {props.hasComment && (
            <TldrawUiInput
              className="tlui-embed-dialog__input"
              placeholder="Roll comment"
              autofocus
              onValueChange={(value) => {
                setComment(value);
              }}
            />
          )}
        </div>
      </TldrawUiDialogBody>
      <TldrawUiDialogFooter>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <TldrawUiButton onPointerDown={roll} type="normal">
            Roll
          </TldrawUiButton>
        </div>
      </TldrawUiDialogFooter>
    </>
  );
};
