import React from "react";
import { fireEvent, render, wait } from "test-utils/test-utils";
import { IPForm } from "../IPForm";

const submitMock = jest.fn();

afterEach(() => {
  submitMock.mockReset();
});

it("matches snapshot", () => {
  const { asFragment } = render(<IPForm onSubmit={submitMock} />);
  expect(asFragment()).toMatchSnapshot();
});

it("can enter a valid ip address", async () => {
  const { getByPlaceholderText, getByLabelText } = render(
    <IPForm onSubmit={submitMock} />
  );
  const inp = getByPlaceholderText("IP Address");
  fireEvent.change(inp, {
    target: { value: "1.1.1.1" },
  });
  await wait(() => {
    expect(inp).toHaveValue("1.1.1.1");
  });
  const submit = getByLabelText("Search IP Address");
  fireEvent.click(submit);
  await wait(() => {
    expect(submitMock).toHaveBeenCalledTimes(1);
    expect(submitMock).toHaveBeenCalledWith("1.1.1.1");
  });
});

it("does not submit invalid ip addresses", async () => {
  const invalid = ["not an ip", "555.1.1.1", "...", "1.1.1", ""];
  const {
    getByPlaceholderText,
    getByLabelText,
    getByText,
    queryByText,
  } = render(<IPForm onSubmit={submitMock} />);
  const inp = getByPlaceholderText("IP Address");
  const submit = getByLabelText("Search IP Address");

  for (let value of invalid) {
    fireEvent.change(inp, {
      target: { value },
    });
    await wait(() => {
      expect(inp).toHaveValue(value);
      expect(queryByText("Invalid IP Address.")).not.toBeInTheDocument();
    });
    fireEvent.click(submit);
    await wait(() => {
      expect(getByText("Invalid IP Address.")).toBeInTheDocument();
    });
  }
});

it("submits valid ip addresses", async () => {
  const valid = ["255.255.255.255", "0.0.0.0", "8.8.8.8", "127.0.0.1"];
  const { getByPlaceholderText, getByLabelText, queryByText } = render(
    <IPForm onSubmit={submitMock} />
  );
  const inp = getByPlaceholderText("IP Address");
  const submit = getByLabelText("Search IP Address");
  let count = 1;

  for (let value of valid) {
    fireEvent.change(inp, {
      target: { value },
    });
    await wait(() => {
      expect(inp).toHaveValue(value);
    });
    fireEvent.click(submit);
    await wait(() => {
      expect(queryByText("Invalid IP Address.")).not.toBeInTheDocument();
      expect(submitMock).toHaveBeenCalledTimes(count);
      expect(submitMock).toHaveBeenCalledWith(value);
    });
    count++;
  }
});
