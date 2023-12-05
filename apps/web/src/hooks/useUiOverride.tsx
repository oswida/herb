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
import { IMarkdownShape, MarkdownSettings } from "../shapes";
import React from "react";
import { TimerSettings } from "../shapes/TimerSettings";
import { ITimerShape } from "../shapes/TimerShape";
import { RpgResourceSettings } from "../shapes/RpgResourceSettings";
import { IRpgResourceShape } from "../shapes/RpgResourceShape";

const hasSettings = (editor: Editor) => {
  const shapes = editor.getSelectedShapes();
  if (shapes.length !== 1) return false;
  return ["markdown", "timer", "rpg-resource"].includes(shapes[0].type);
};

export const useUiOverride = (
  editor: Editor | undefined,
  roomId: string,
  baseUrl: string
) => {
  const insertPdf = useInsertFile(editor, "pdf", roomId, baseUrl);
  const insertHandout = useInsertFile(editor, "handout", roomId, baseUrl);
  const insertJson = useInsertJson(editor);
  const { backupPage } = useBackup(editor);

  const uiOverrides: TLUiOverrides = {
    contextMenu(editor, schema, helpers) {
      if (hasSettings(editor)) {
        schema.push(
          menuItem({
            id: "custom-settings",
            label: "Settings" as any,
            readonlyOk: false,
            onSelect: () => {
              const shp = editor.getSelectedShapes();
              if (shp.length !== 1) return;
              switch (shp[0].type) {
                case "markdown":
                  helpers.addDialog({
                    id: "markdown-settings",
                    component: ({ onClose }) => (
                      <MarkdownSettings
                        onClose={onClose}
                        shape={shp[0] as IMarkdownShape}
                      />
                    ),
                    onClose: () => {},
                  });
                  break;
                case "timer":
                  helpers.addDialog({
                    id: "timer-settings",
                    component: ({ onClose }) => (
                      <TimerSettings
                        onClose={onClose}
                        shape={shp[0] as ITimerShape}
                      />
                    ),
                    onClose: () => {},
                  });
                  break;
                case "rpg-resource":
                  helpers.addDialog({
                    id: "rpg-res-settings",
                    component: ({ onClose }) => (
                      <RpgResourceSettings
                        onClose={onClose}
                        shape={shp[0] as IRpgResourceShape}
                      />
                    ),
                    onClose: () => {},
                  });
                  break;
              }
            },
          })
        );
      }
      return schema;
    },
    menu(editor, menu) {
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

      tools.timer = {
        id: "timer",
        icon: "timer",
        label: "Timer" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("timer");
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

      return tools;
    },
    toolbar(_app, toolbar, { tools }) {
      toolbar.push(toolbarItem(tools.rpgClock));
      toolbar.push(toolbarItem(tools.timer));
      toolbar.push(toolbarItem(tools.rpgRes));
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