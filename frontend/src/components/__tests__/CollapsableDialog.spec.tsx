import { CollapsableDialog } from "components/CollapsableDialog";
import React from "react";
import { fireEvent, render, wait } from "test-utils/test-utils";

const setExpandedMock = jest.fn();
const defaultProps = {
  title: "some title",
  menuExpanded: true,
  collapsed: false,
  setMenuExpanded: setExpandedMock,
};

afterEach(() => {
  setExpandedMock.mockReset();
});

it("matches snapshot", () => {
  const { asFragment } = render(<CollapsableDialog {...defaultProps} />);
  expect(asFragment()).toMatchSnapshot();
});

it("matches collapsed snapshot", () => {
  const props = {
    ...defaultProps,
    collapsed: true,
  };
  const { asFragment } = render(<CollapsableDialog {...props} />);
  expect(asFragment()).toMatchSnapshot();
});

it("can expand menu", async () => {
  const props = {
    ...defaultProps,
    menuExpanded: false,
  };
  const { queryByText, getByLabelText } = render(
    <CollapsableDialog {...props}>
      <div>CHILDREN</div>
    </CollapsableDialog>
  );
  expect(queryByText("CHILDREN")).not.toBeInTheDocument();
  fireEvent.click(getByLabelText("toggle menu expanded"));
  await wait(() => {
    expect(setExpandedMock).toHaveBeenCalledTimes(1);
  });
});

it("can collapse menu", async () => {
  const props = {
    ...defaultProps,
    menuExpanded: true,
  };
  const { getByText, getByLabelText } = render(
    <CollapsableDialog {...props}>
      <div>CHILDREN</div>
    </CollapsableDialog>
  );
  expect(getByText("CHILDREN")).toBeInTheDocument();
  fireEvent.click(getByLabelText("toggle menu expanded"));
  await wait(() => {
    expect(setExpandedMock).toHaveBeenCalledTimes(1);
  });
});
