import { TLUiOverrides, toolbarItem } from "@tldraw/tldraw";

// // In order to see select our custom shape tool, we need to add it to the ui.

export const uiOverrides: TLUiOverrides = {
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
