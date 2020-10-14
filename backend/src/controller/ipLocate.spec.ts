import { build } from "../app";
import { mocked } from "ts-jest/utils";
import { getReader } from "../db";
import ReaderModel from "@maxmind/geoip2-node/dist/src/readerModel";

jest.mock("../db/cityReader", () => ({
  getReader: jest.fn(),
}));
const getReaderMock = mocked(getReader);

const cityLookupMock = jest.fn();

beforeAll(() => {
  // only using the city method of reader
  const reader = ({
    city: cityLookupMock,
    asn: jest.fn(),
  } as unknown) as ReaderModel;
  getReaderMock.mockReturnValue(reader);
});

afterEach(() => {
  cityLookupMock.mockReset();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("GET /ip/health", () => {
  it("can successfully health check", async () => {
    const app = build();
    const resp = {
      country: {
        names: {
          en: "United States",
        },
      },
    };

    cityLookupMock.mockReturnValue(resp);
    const response = await app.inject({
      method: "GET",
      url: "/ip/health",
    });
    expect(cityLookupMock).toHaveBeenCalledTimes(1);
    expect(cityLookupMock).toHaveBeenCalledWith("8.8.8.8");
    expect(response.statusCode).toStrictEqual(200);
    expect(response.body).toStrictEqual("");
  });

  it("returns 500 on database error", async () => {
    const app = build();
    cityLookupMock.mockImplementation(() => {
      throw new Error("database error");
    });
    const response = await app.inject({
      method: "GET",
      url: "/ip/health",
    });
    expect(cityLookupMock).toHaveBeenCalledTimes(1);
    expect(cityLookupMock).toHaveBeenCalledWith("8.8.8.8");
    expect(response.statusCode).toStrictEqual(500);
    expect(response.json()).toMatchObject({
      message: "database error",
    });
  });

  it("returns 500 on database not found", async () => {
    const app = build();
    cityLookupMock.mockReturnValue({});
    const response = await app.inject({
      method: "GET",
      url: "/ip/health",
    });
    expect(cityLookupMock).toHaveBeenCalledTimes(1);
    expect(cityLookupMock).toHaveBeenCalledWith("8.8.8.8");
    expect(response.statusCode).toStrictEqual(500);
    expect(response.body).toStrictEqual("");
  });

  it("returns 500 on AddressNotFoundError", async () => {
    // for the purpose of a healthcheck allow this to 500
    const app = build();
    const err = new Error("message");
    err.name = "AddressNotFoundError";
    cityLookupMock.mockImplementation(() => {
      throw err;
    });
    const response = await app.inject({
      method: "GET",
      url: "/ip/health",
      query: {
        ip: "127.0.0.1",
      },
    });
    expect(response.statusCode).toStrictEqual(500);
  });
});

describe("GET /ip/search", () => {
  it("validates ip address is required", async () => {
    const app = build();
    const response = await app.inject({
      method: "GET",
      url: "/ip/search",
    });
    expect(response.statusCode).toStrictEqual(400);
    expect(response.json()).toMatchObject({
      message: "querystring should have required property 'ip'",
    });
  });

  it("validates ip address format", async () => {
    const app = build();
    const invalid = [
      "1234",
      // "fe80:3::1ff:fe23:4567:890a",
      "257.0.0.0",
      "0.0.0.-1",
      "asdf",
      "",
      "1.1",
    ];
    for (let value of invalid) {
      const response = await app.inject({
        method: "GET",
        url: "/ip/search",
        query: {
          ip: value,
        },
      });
      expect(response.statusCode).toStrictEqual(400);
      expect(response.json()).toMatchObject({
        message:
          'querystring.ip should match format "ipv4", querystring.ip should match format "ipv6", querystring.ip should match some schema in anyOf',
      });
    }
  });

  it("returns cityInfo from mmdb reader", async () => {
    const app = build();
    const resp = {
      data: "any",
    };
    cityLookupMock.mockReturnValue(resp);
    const response = await app.inject({
      method: "GET",
      url: "/ip/search",
      query: {
        ip: "127.0.0.1",
      },
    });
    expect(response.statusCode).toStrictEqual(200);
    expect(response.json()).toMatchObject(resp);
  });

  it("returns 404 on AddressNotFoundError", async () => {
    const app = build();
    const err = new Error("message");
    err.name = "AddressNotFoundError";
    cityLookupMock.mockImplementation(() => {
      throw err;
    });
    const response = await app.inject({
      method: "GET",
      url: "/ip/search",
      query: {
        ip: "127.0.0.1",
      },
    });
    expect(response.statusCode).toStrictEqual(404);
  });
});
