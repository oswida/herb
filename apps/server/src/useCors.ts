import type { IncomingMessage, ServerResponse } from "node:http";

export const useCors = () => {
  const origin = "*";
  const maxAge = 60 * 60 * 24;
  const cors = (request: IncomingMessage, response: ServerResponse) => {
    const reqOrigin = request.headers.origin;
    const reqHeaders = request.headers["access-control-request-headers"];
    const reqMethod = request.headers["access-control-request-method"];

    if (typeof reqOrigin !== "undefined") {
      // can (validly) be an empty string
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Access-Control-Max-Age", maxAge.toString());
    }

    if (reqHeaders)
      response.setHeader("Access-Control-Allow-Headers", reqHeaders);

    if (reqMethod)
      response.setHeader("Access-Control-Allow-Methods", reqMethod);

    if (request.method === "OPTIONS") {
      response.statusCode = 204;
      response.end();
      return true;
    }
    return false;
  };
  return { cors };
};
