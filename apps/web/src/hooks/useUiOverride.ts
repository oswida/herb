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

// // In order to see select our custom shape tool, we need to add it to the ui.
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
        icon: "question-mark-circle",
        label: "RPG clock" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("rpg-clock");
        },
      };

      tools.timer = {
        id: "timer",
        icon: "question-mark-circle",
        label: "Timer" as any,
        readonlyOk: false,
        onSelect: () => {
          editor.setCurrentTool("timer");
        },
      };

      return tools;
    },
    toolbar(_app, toolbar, { tools }) {
      toolbar.push(toolbarItem(tools.rpgClock));
      toolbar.push(toolbarItem(tools.timer));
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
