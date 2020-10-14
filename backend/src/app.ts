import fastify from "fastify";
import router from "./router";

export const build = (opts = {}) => {
  const app = fastify(opts);
  app.register(router);
  return app;
};
