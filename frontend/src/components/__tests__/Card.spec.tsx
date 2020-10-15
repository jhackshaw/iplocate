import React from "react";
import { render } from "test-utils/test-utils";
import { Card } from "../Card";

it("matches snapshot", () => {
  const { asFragment } = render(<Card />);
  expect(asFragment()).toMatchSnapshot();
});
