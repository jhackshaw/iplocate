import { CollapsableDialog } from "components/CollapsableDialog";
import React from "react";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { asFragment } = render(<CollapsableDialog collapsed />);
  expect(asFragment()).toMatchSnapshot();
});
