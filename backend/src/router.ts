import { FastifyInstance } from "fastify";
import { ipLocate } from "./controller";

export default async function router(fastify: FastifyInstance) {
  fastify.register(ipLocate, { prefix: "/ip" });
}
