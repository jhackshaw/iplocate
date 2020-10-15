import React from "react";
import {
  render,
  baseIP,
  fireEvent,
  wait,
  getByAltText,
  queryByLabelText,
} from "test-utils";
import { Home } from "../Home";
import { request } from "utils/request";

const otherIP = {
  ...baseIP,
  traits: {
    ...baseIP.traits,
    ipAddress: "9.9.9.9",
  },
};

jest.mock("components/Map", () => ({
  Map: () => <div />,
}));
jest.mock("utils/request", () => ({
  request: jest.fn(),
}));
const mockRequest = request as jest.Mock;

jest.spyOn(Storage.prototype, "setItem");
const setItemMock = localStorage.setItem as jest.Mock;

jest.spyOn(Storage.prototype, "getItem");
const getItemMock = localStorage.getItem as jest.Mock;

beforeEach(() => {
  getItemMock.mockReturnValue(null);
});

afterEach(() => {
  mockRequest.mockReset();
  setItemMock.mockReset();
  getItemMock.mockReset();
});

afterAll(() => {
  jest.restoreAllMocks();
});

const renderAndSearch = async (value: string) => {
  const { getByLabelText, ...rest } = render(<Home />);
  const inp = getByLabelText("IP Address input");
  fireEvent.change(inp, {
    target: { value },
  });
  await wait(() => expect(inp).toHaveValue(value));
  fireEvent.click(getByLabelText("Search IP Address"));
  await wait(() => {
    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(mockRequest).toHaveBeenCalledWith(`/ip/search?ip=${value}`);
  });
  return { getByLabelText, ...rest };
};

it("matches snapshot", () => {
  const { asFragment } = render(<Home />);
  expect(asFragment()).toMatchSnapshot();
});

it("can search for an ip", async () => {
  await renderAndSearch("1.1.1.1");
});

it("adds search result to ip menu", async () => {
  mockRequest.mockResolvedValue(baseIP);
  const { getByText } = await renderAndSearch("1.1.1.1");
  expect(getByText(baseIP.traits.ipAddress!)).toBeInTheDocument();
});

it("throws error if latitude not present", async () => {
  mockRequest.mockResolvedValue({
    ...baseIP,
    location: {
      ...baseIP.location,
      latitude: undefined!,
    },
  });
  const { getByText } = await renderAndSearch("1.1.1.1");
  expect(getByText("Unable to locate IP")).toBeInTheDocument();
});

it("removes ip on trash icon click", async () => {
  mockRequest.mockResolvedValue(baseIP);
  const { getByText, queryByText, getByLabelText } = await renderAndSearch(
    "1.1.1.1"
  );
  expect(getByText(baseIP.traits.ipAddress!)).toBeInTheDocument();
  fireEvent.click(getByLabelText("remove ip address"));
  await wait(() => {
    expect(queryByText(baseIP.traits.ipAddress!)).not.toBeInTheDocument();
  });
});

it("toggles visibility on eye icon click", async () => {
  getItemMock.mockReturnValue(JSON.stringify([otherIP]));
  mockRequest.mockResolvedValue(baseIP);
  const {
    getByText,
    queryByLabelText,
    getByLabelText,
    getAllByLabelText,
  } = await renderAndSearch("1.1.1.1");
  expect(getByText(baseIP.traits.ipAddress!)).toBeInTheDocument();
  fireEvent.click(getAllByLabelText("toggle ip visibility off")[0]);
  await wait(() => {
    expect(queryByLabelText("toggle ip visibility on")).toBeInTheDocument();
  });
  fireEvent.click(getByLabelText("toggle ip visibility on"));
  await wait(() => {
    expect(getAllByLabelText("toggle ip visibility off")).toHaveLength(2);
  });
});

it("populates from localstorage", async () => {
  mockRequest.mockResolvedValue(baseIP);
  getItemMock.mockReturnValue(JSON.stringify([otherIP]));
  const { getByText } = await renderAndSearch("1.2.2.2");
  expect(getByText(otherIP.traits.ipAddress)).toBeInTheDocument();
  expect(getByText(baseIP.traits.ipAddress!)).toBeInTheDocument();
  expect(getItemMock).toHaveBeenCalledTimes(1);
  expect(getItemMock.mock.calls[0][0]).toStrictEqual("allIps");
  expect(setItemMock).toHaveBeenCalledTimes(2);
  expect(setItemMock.mock.calls[1][0]).toStrictEqual("allIps");
  expect(setItemMock.mock.calls[1][1]).toStrictEqual(
    JSON.stringify([baseIP, otherIP])
  );
});
