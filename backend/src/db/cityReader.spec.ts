import { getReader } from "./cityReader";

test("can lookup an ip", async () => {
  const reader = getReader();
  expect(reader.city("2a02:d2c0::")).toMatchObject({
    country: {
      names: {
        en: "Iran",
      },
    },
    location: {
      latitude: 32,
      longitude: 53,
    },
  });
});

test("throws error on ip not found", async () => {
  const reader = getReader();
  expect(() => reader.city("8.8.8.8")).toThrowError(
    "The address 8.8.8.8 is not in the database"
  );
});

test("recycles reader instance across requests", async () => {
  const reader = getReader();
  expect(getReader()).toStrictEqual(reader);
});
