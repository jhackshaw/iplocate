import { build } from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3000;

const server = build({
  logger: {
    level: "info",
  },
});

// Start server
server.listen(FASTIFY_PORT, "0.0.0.0");
console.log(`🚀 IP Geo lookup service running on port ${FASTIFY_PORT}`);
