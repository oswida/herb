import { DiceRoll } from "@dice-roller/rpg-dice-roller";

export const GLOBAL_INFO_SHAPE = "global:info:shape";

export type ChatMsg = {
  id: string;
  roll?: DiceRoll;
  rollMarkers?: string[];
  text?: string;
  comment?: string;
  userName: string;
  userId: string;
  tstamp: string;
  priv?: boolean;
};

export type Presence = {
  id: string;
  name: string;
  color: string;
};

export interface RoomData {
  owner: string;
  id: string;
  secure: boolean;
  allowedUsers: string[];
  blockedUsers: string[];
}
