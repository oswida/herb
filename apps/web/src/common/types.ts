import { DiceRoll } from "@dice-roller/rpg-dice-roller";

export const UPLOAD_URL = "http://localhost:5001/api/upload";
export const ASSET_LIST_URL = "http://localhost:5001/api/asset-list";

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
