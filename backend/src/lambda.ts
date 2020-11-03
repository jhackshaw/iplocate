import awsServerlessExpress from "aws-serverless-express";
import { build } from "./app";
import { APIGatewayProxyEvent, Callback, Context } from "aws-lambda";
import { IncomingMessage, Server, ServerResponse } from "http";

type ReqListener = (req: IncomingMessage, res: ServerResponse) => void;

let server: Server;
const serverFactory = (handler: ReqListener) => {
  server = awsServerlessExpress.createServer(handler);
  return server;
};

const app = build({ serverFactory });

export const handler = (
  event: APIGatewayProxyEvent,
  context: Context,
  cb: Callback
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  app.ready((e) => {
    if (e) return console.error(e.stack || e);
    awsServerlessExpress.proxy(server, event, context, "CALLBACK", cb);
  });
};
