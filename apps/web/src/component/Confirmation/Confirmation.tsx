import {
  Button,
  Dialog,
  Input,
  TLUiDialogProps,
  getUserPreferences,
  setUserPreferences,
  useEditor,
} from "@tldraw/tldraw";
import { flexColumnStyle } from "../../common";
import React, { useEffect, useState } from "react";

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
      <Dialog.Header>
        <Dialog.Title>{props.title}</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>
        {props.message.split("\n").map((it) => (
          <div key={it}>{it}</div>
        ))}
      </Dialog.Body>
      <Dialog.Footer>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onPointerDown={activate} type="normal">
            Ok
          </Button>
          <Button type="normal" onPointerDown={props.onClose}>
            Cancel
          </Button>
        </div>
      </Dialog.Footer>
    </>
  );
};
