import {
  TLUiDialogProps,
  TldrawUiButton,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogFooter,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
} from "@tldraw/tldraw";
import React from "react";

type Props = TLUiDialogProps & {
  title: string;
  message: string;
  callback: () => void;
};

export const Confirmation = (props: Props) => {
  const activate = async () => {
    props.onClose();
    await props.callback();
  };

  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>{props.title}</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody>
        {props.message.split("\n").map((it) => (
          <div key={it}>{it}</div>
        ))}
      </TldrawUiDialogBody>
      <TldrawUiDialogFooter>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TldrawUiButton onPointerDown={activate} type="normal">
            Ok
          </TldrawUiButton>
          <TldrawUiButton type="normal" onPointerDown={props.onClose}>
            Cancel
          </TldrawUiButton>
        </div>
      </TldrawUiDialogFooter>
    </>
  );
};
