import { DiceRoll } from "@dice-roller/rpg-dice-roller";

export type ChatMsg = {
  id: string;
  roll?: DiceRoll;
  text?: string;
  comment?: string;
  userName: string;
  userId: string;
  tstamp: string;
  priv?: boolean;
};
