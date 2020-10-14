import { CountryRecord } from "@maxmind/geoip2-node";
import { FastifyInstance, RouteOptions } from "fastify";
import { getReader } from "../db";

const opts: Partial<RouteOptions> = {
  schema: {
    querystring: {
      required: ["ip"],
      type: "object",
      properties: {
        ip: {
          anyOf: [
            { type: "string", format: "ipv4" },
            { type: "string", format: "ipv6" },
          ],
        },
      },
    },
  },
  errorHandler: (error, _, reply) => {
    if (error.name === "AddressNotFoundError") {
      reply.status(404).send();
    } else {
      throw error;
    }
  },
};

type SearchRequest = {
  Querystring: {
    ip: string;
  };
};

const emptyToPartial = <T>(obj: T | {}): Partial<T> => obj;

export const ipLocate = async (fastify: FastifyInstance) => {
  fastify.get<SearchRequest>("/search", opts, (request, reply) => {
    const { ip } = request.query;
    const reader = getReader();
    const cityInfo = reader.city(ip);
    reply.send(cityInfo);
  });

  fastify.get("/health", {}, (_, reply) => {
    const reader = getReader();
    const cityInfo = reader.city("8.8.8.8");
    const country = emptyToPartial<CountryRecord>(cityInfo.country);
    reply.status(country ? 200 : 500);
    reply.send();
  });
};
