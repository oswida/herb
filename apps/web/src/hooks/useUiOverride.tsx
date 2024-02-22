import {
  Editor,
  TLUiOverrides,
  TldrawUiMenuItem,
  toolbarItem,
} from "@tldraw/tldraw";
import { useInsertJson } from "./useInsertJson";
import { useInsertFile } from "./useInsertFile";
import { useBackup } from "./useBackup";
import { Follow } from "../component/Follow";
import { WebsocketProvider } from "y-websocket";
import React from "react";

export const useUiOverride = (
  editor: Editor | undefined,
  roomId: string,
  baseUrl: string,
  roomProvider: WebsocketProvider
) => {
  const uiOverrides: TLUiOverrides = {
    tools(editor, tools) {
      tools.rpgClock = {
        id: "rpg-clock",
        icon: "rpg-clock",
        label: "RPG clock" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("rpg-clock");
        },
      };

      tools.rpgAttr = {
        id: "rpg-attr",
        icon: "rpg-attr",
        label: "RPG Attribute" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("rpg-attr");
        },
      };

      tools.rpgRes = {
        id: "rpg-resource",
        icon: "rpg-resource",
        label: "RPG Resource" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("rpg-resource");
        },
      };

      tools.rpgDice = {
        id: "rpg-dice-roller",
        icon: "rpg-dice",
        label: "Dice Roller" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("rpg-dice-roller");
        },
      };

      tools.rpgCards = {
        id: "rpg-card-stack",
        icon: "rpg-cards",
        label: "Card Stack" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("rpg-card-stack");
        },
      };

      tools.rpgPbtaRoll = {
        id: "rpg-pbta-roll",
        icon: "rpg-pbta-roll",
        label: "PBTA Move" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("rpg-pbta-roll");
        },
      };

      tools.rpgGen = {
        id: "rpg-gen",
        icon: "rpg-gen",
        label: "Item Generator" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("rpg-gen");
        },
      };

      return tools;
    },
    toolbar(_app, toolbar, { tools }) {
      toolbar.push(toolbarItem(tools.rpgClock));
      toolbar.push(toolbarItem(tools.rpgAttr));
      toolbar.push(toolbarItem(tools.rpgRes));
      toolbar.push(toolbarItem(tools.rpgDice));
      toolbar.push(toolbarItem(tools.rpgCards));
      toolbar.push(toolbarItem(tools.rpgPbtaRoll));
      toolbar.push(toolbarItem(tools.rpgGen));
      return toolbar;
    },
  };

  return { uiOverrides };
};
