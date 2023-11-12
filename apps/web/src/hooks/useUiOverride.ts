import {
  Editor,
  TLUiOverrides,
  menuCustom,
  menuGroup,
  menuItem,
  menuSubmenu,
  toolbarItem,
  useEditor,
} from "@tldraw/tldraw";
import { useInsertPdf } from "./useInsertPdf";
import { useInsertJson } from "./useInsertJson";

// // In order to see select our custom shape tool, we need to add it to the ui.
export const useUiOverride = (editor: Editor | undefined) => {
  const insertPdf = useInsertPdf(editor);
  const insertJson = useInsertJson(editor);

  const uiOverrides: TLUiOverrides = {
    menu(editor, menu) {
      const items = [
        menuItem({
          id: "upload-pdf",
          label: "Upload PDF" as any,
          readonlyOk: false,
          onSelect: () => {
            insertPdf();
          },
        }),
        menuItem({
          id: "upload-json",
          label: "Upload JSON" as any,
          readonlyOk: false,
          onSelect: () => {
            insertJson();
          },
        }),
      ];
      const grp = menuGroup("upload-other", ...items);
      if (grp) {
        menu.push(grp);
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

      return tools;
    },
    toolbar(_app, toolbar, { tools }) {
      toolbar.push(toolbarItem(tools.rpgClock));

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
