import React from "react";
import { render } from "test-utils";
import { Loading } from "../Loading";

it("matches snapshot", () => {
  const { asFragment } = render(<Loading />);
  expect(asFragment()).toMatchSnapshot();
});
