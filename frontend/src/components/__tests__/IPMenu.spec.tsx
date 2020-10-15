import React from "react";
import { render, baseIP, fireEvent, wait } from "test-utils";
import { IP } from "types";
import { IPMenu } from "../IPMenu";

// ['1.1.1.1', '2.2.2.2', '3.3.3.3']
const allIps: IP[] = Array.from({ length: 3 }).map((_, idx) => ({
  ...baseIP,
  traits: {
    ...baseIP.traits,
    ipAddress: Array.from({ length: 4 })
      .map((_) => idx + 1)
      .join("."),
  },
}));

const setCurrentMock = jest.fn();
const removeMock = jest.fn();
const toggleVisibleMock = jest.fn();

afterEach(() => {
  setCurrentMock.mockReset();
  removeMock.mockReset();
  toggleVisibleMock.mockReset();
});

const renderMocked = (ips: IP[]) => {
  return render(
    <IPMenu
      ips={ips}
      onSetCurrentIp={setCurrentMock}
      onRemoveIp={removeMock}
      onToggleIpVisible={toggleVisibleMock}
    />
  );
};

it("matches snapshot", () => {
  const { asFragment } = renderMocked(allIps);
  expect(asFragment()).toMatchSnapshot();
});

it("sets current ip on address click", async () => {
  const { getByText } = renderMocked(allIps);
  expect(getByText("1.1.1.1")).toBeInTheDocument();
  fireEvent.click(getByText("1.1.1.1"));
  await wait(() => {
    expect(setCurrentMock).toHaveBeenCalledTimes(1);
    expect(setCurrentMock.mock.calls[0][0]).toMatchObject(allIps[0]);
  });
});

it("removes ip address on trash icon click", async () => {
  const { getAllByLabelText } = renderMocked(allIps);
  expect(getAllByLabelText("remove ip address")).toHaveLength(3);
  fireEvent.click(getAllByLabelText("remove ip address")[1]);
  await wait(() => {
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock.mock.calls[0][0]).toMatchObject(allIps[1]);
  });
});

it("toggles visibility of ip on eye icon click", async () => {
  const { getAllByLabelText } = renderMocked(allIps);
  expect(getAllByLabelText("toggle ip visibility off")).toHaveLength(3);
  fireEvent.click(getAllByLabelText("toggle ip visibility off")[1]);
  await wait(() => {
    expect(toggleVisibleMock).toHaveBeenCalledTimes(1);
    expect(toggleVisibleMock.mock.calls[0][0]).toMatchObject(allIps[1]);
  });
});

it("returns nothing if there are no ips", async () => {
  const { container } = renderMocked([]);
  expect(container.childElementCount).toEqual(0);
});
