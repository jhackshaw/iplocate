import { request } from "../request";

const mockFetch = jest.fn();
let oldFetch: typeof window.fetch;

beforeAll(() => {
  oldFetch = window.fetch;
  window.fetch = mockFetch;
});

beforeEach(() => {
  mockFetch.mockReset();
});

afterAll(() => {
  window.fetch = oldFetch;
});

it("passes request to fetch api", async () => {
  mockFetch.mockResolvedValue({
    json: jest.fn(() => ({ data: "" })),
    ok: true,
  });
  const res = await request("testurl");
  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockFetch.mock.calls[0][0]).toStrictEqual("testurl");
  expect(res).toMatchObject({
    data: "",
  });
});

it("throws error if request is not 'ok'", async () => {
  mockFetch.mockResolvedValue({
    json: undefined,
    ok: false,
    statusText: "some status text",
  });
  try {
    await request("testurl");
  } catch (e) {
    expect(e).toEqual(new Error("some status text"));
  }
});
