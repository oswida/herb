import { atom } from "jotai";
import { Presence, RoomData } from "./types";
import { TLShapeId } from "@tldraw/tldraw";

export const uiVisible = atom(true);
export const diceRollerVisible = atom(false);
export const assetListVisible = atom(false);

export const currentRoom = atom<string | undefined>(undefined);
export const roomPresence = atom<Record<string, Presence>>({});
export const roomData = atom<RoomData | undefined>(undefined);

export const urlUpload = atom<string>("");
export const urlRoom = atom<string>("");

export const animatedRollNotation = atom<string>("");

export const diceBox = atom<any>(undefined);

export const isCreator = atom<boolean>(false);

export const assetFilter = atom<string>("");

export const customSettingsVisible = atom<boolean>(false);
export const selectedCustomShape = atom<TLShapeId | null>(null);
