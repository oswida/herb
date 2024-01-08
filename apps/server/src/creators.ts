import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Request, Response } from "express";

export const loadCreators = () => {
  if (!existsSync("creators.json")) writeFileSync("creators.json", "[]");
  const creatorsFile = readFileSync("creators.json");
  return JSON.parse(creatorsFile.toString()) as string[];
};

export const processCreators = (request: Request, response: Response) => {
  const creators = loadCreators();

  if (creators.length === 0 || !request.params.userId) {
    response.json({ isCreator: false });
    return;
  }
  response.json({ isCreator: creators.includes(request.params.userId) });
};
