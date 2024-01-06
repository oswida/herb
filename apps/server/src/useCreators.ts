/* eslint-disable @typescript-eslint/no-unused-vars -- comment */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";

export const useCreators = () => {
  if (!existsSync("creators.json")) writeFileSync("creators.json", "[]");
  const creatorsFile = readFileSync("creators.json");
  const cdata = JSON.parse(creatorsFile.toString()) as string[];

  const processCreators = (
    request: IncomingMessage,
    response: ServerResponse & {
      req: IncomingMessage;
    }
  ) => {
    if (
      !request.url?.startsWith("/api/creator") ||
      request.method === undefined ||
      creatorsFile.length === 0
    )
      return false;
    const parts = request.url.split("/");
    if (parts.length < 4) return false;
    const userId = parts[3];
    if (!userId || userId.trim() === "") return false;
    response.writeHead(200, {
      "Content-Type": "application/json",
    });
    response.write(JSON.stringify({ isCreator: cdata.includes(userId) }));
    response.end();
    return true;
  };

  return { processCreators };
};
