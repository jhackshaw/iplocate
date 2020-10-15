import fastify from "fastify";
import cors from "fastify-cors";
import router from "./router";

export const build = (opts = {}) => {
  const app = fastify(opts);
  if (process.env.FRONTEND_DOMAIN) {
    app.register(cors, {
      origin: process.env.FRONTEND_DOMAIN,
    });
  }
  app.register(router);
  return app;
};
