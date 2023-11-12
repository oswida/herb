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
  const activate = () => {
    props.onClose();
    props.callback();
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>{props.title}</Dialog.Title>
        <Dialog.CloseButton />
      </Dialog.Header>
      <Dialog.Body>{props.message}</Dialog.Body>
      <Dialog.Footer>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={activate} type="normal">
            Ok
          </Button>
          <Button type="normal" onClick={props.onClose}>
            Cancel
          </Button>
        </div>
      </Dialog.Footer>
    </>
  );
};
