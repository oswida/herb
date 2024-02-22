import {
  DefaultMainMenu,
  DefaultMainMenuContent,
  TLUiEventSource,
  TldrawUiDropdownMenuIndicator,
  TldrawUiMenuGroup,
  TldrawUiMenuItem,
  TldrawUiMenuSubmenu,
  useDefaultHelpers,
  useEditor,
} from "@tldraw/tldraw";
import React from "react";
import { useBackup } from "../../hooks";
import { useInsertFile } from "../../hooks/useInsertFile";
import { useInsertJson } from "../../hooks/useInsertJson";
import { Follow } from "../../component/Follow";
import { WebsocketProvider } from "y-websocket";

type Props = {
  roomId: string;
  baseUrl: string;
  roomProvider: WebsocketProvider;
};

export const MainMenu = ({ roomId, baseUrl, roomProvider }: Props) => {
  const editor = useEditor();
  const insertPdf = useInsertFile(editor, "pdf", roomId, baseUrl);
  const insertHandout = useInsertFile(editor, "handout", roomId, baseUrl);
  const insertJson = useInsertJson(editor);
  const { backupPage } = useBackup(editor);
  const { addDialog } = useDefaultHelpers();

  return (
    <DefaultMainMenu>
      <DefaultMainMenuContent />
      <TldrawUiMenuGroup id="rpg-group">
        <TldrawUiMenuSubmenu id="upload-other" label="Upload">
          <TldrawUiMenuItem
            id="upload-pdf"
            label="PDF Document"
            onSelect={function (source: TLUiEventSource): void | Promise<void> {
              insertPdf();
            }}
          />
          <TldrawUiMenuItem
            id="upload-markdown"
            label="Markdown File"
            onSelect={function (source: TLUiEventSource): void | Promise<void> {
              insertHandout();
            }}
          />
        </TldrawUiMenuSubmenu>
        <TldrawUiMenuSubmenu id="backup" label="Backup">
          <TldrawUiMenuItem
            id="backup-page"
            label="Backup Page"
            onSelect={function (source: TLUiEventSource): void | Promise<void> {
              backupPage();
            }}
          />
          <TldrawUiMenuItem
            id="upload-json"
            label="Restore JSON Data"
            onSelect={function (source: TLUiEventSource): void | Promise<void> {
              insertJson();
            }}
          />
        </TldrawUiMenuSubmenu>

        <TldrawUiMenuItem
          id="follow-user"
          label="Follow User"
          onSelect={function (source: TLUiEventSource): void | Promise<void> {
            addDialog({
              id: "follow-user-dialog",
              component: () => (
                <Follow onClose={() => {}} roomProvider={roomProvider} />
              ),
              onClose: () => {},
            });
          }}
        />
      </TldrawUiMenuGroup>
    </DefaultMainMenu>
  );
};
