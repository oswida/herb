import { atom } from "jotai";
import { Presence } from "./types";

export const uiVisible = atom(true);
export const diceRollerVisible = atom(false);
export const csheetVisible = atom(false);
export const notesVisible = atom(false);

export const currentRoom = atom<string | undefined>(undefined);
export const roomPresence = atom<Record<string, Presence>>({});
