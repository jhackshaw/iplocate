import { CollapsableDialog } from "components/CollapsableDialog";
import React from "react";
import { render } from "test-utils/test-utils";

it("matches snapshot", () => {
  const { asFragment } = render(<CollapsableDialog collapsed />);
  expect(asFragment()).toMatchSnapshot();
});

it("matches collapsed snapshot", () => {
  const { asFragment } = render(<CollapsableDialog collapsed={false} />);
  expect(asFragment()).toMatchSnapshot();
});
