import React from "react";
import { Footer } from "../Footer";
import { render } from "test-utils/test-utils";

it("matches snapshot", () => {
  const { asFragment } = render(<Footer />);
  expect(asFragment()).toMatchSnapshot();
});
