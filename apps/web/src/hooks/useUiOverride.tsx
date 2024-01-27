import {
  Editor,
  TLUiOverrides,
  menuGroup,
  menuItem,
  menuSubmenu,
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
  const insertPdf = useInsertFile(editor, "pdf", roomId, baseUrl);
  const insertHandout = useInsertFile(editor, "handout", roomId, baseUrl);
  const insertJson = useInsertJson(editor);
  const { backupPage } = useBackup(editor);

  const uiOverrides: TLUiOverrides = {
    menu(editor, menu, helpers) {
      const items = [
        menuItem({
          id: "upload-pdf",
          label: "PDF document" as any,
          readonlyOk: false,
          onSelect: () => {
            insertPdf();
          },
        }),
        menuItem({
          id: "upload-handout",
          label: "Markdown file" as any,
          readonlyOk: false,
          onSelect: () => {
            insertHandout();
          },
        }),
      ];

      const sub = menuSubmenu("upload-other-sub", "Upload" as any, ...items);
      const grp = menuGroup("upload-other", sub);
      if (grp) {
        menu.push(grp);
      }

      const bkpItems = [
        menuItem({
          id: "backup-page",
          label: "Backup page" as any,
          readonlyOk: false,
          onSelect: () => {
            backupPage();
          },
        }),
        menuItem({
          id: "upload-json",
          label: "Restore JSON" as any,
          readonlyOk: false,
          onSelect: () => {
            insertJson();
          },
        }),
      ];

      const bsub = menuSubmenu("backup-sub", "Backup" as any, ...bkpItems);
      const bgrp = menuGroup("backup-restore", bsub);
      if (bgrp) {
        menu.push(bgrp);
      }

      menu.push(
        menuItem({
          id: "follow-user",
          label: "Follow user" as any,
          readonlyOk: false,
          onSelect: () => {
            helpers.addDialog({
              component: ({ onClose }) => (
                <Follow onClose={onClose} roomProvider={roomProvider} />
              ),
              onClose: () => {},
            });
          },
        })
      );

      return menu;
    },
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
        label: "PBTA Roll" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("rpg-pbta-roll");
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
      return toolbar;
    },
    keyboardShortcutsMenu(_app, keyboardShortcutsMenu, { tools }) {
      // Add the tool item from the context to the keyboard shortcuts dialog.
      // const toolsGroup = keyboardShortcutsMenu.find(
      // 	(group) => group.id === 'shortcuts-dialog.tools'
      // ) as TLUiMenuGroup
      // toolsGroup.children.push(menuItem(tools.card))
      return keyboardShortcutsMenu;
    },
  };

  return { uiOverrides };
};
