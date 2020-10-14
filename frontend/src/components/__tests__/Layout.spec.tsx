import { get } from "https";
import React from "react";
import { render } from "test-utils";
import { Layout } from "../Layout";

jest.mock("../Footer", () => ({
  Footer: () => <footer>Mock Footer</footer>,
}));

afterAll(() => {
  jest.restoreAllMocks();
});

it("matches snapshot", () => {
  const { asFragment } = render(<Layout />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders children", () => {
  const { getByTestId } = render(
    <Layout>
      <div data-testid="child">Content</div>
    </Layout>
  );
  expect(getByTestId("child")).toHaveTextContent("Content");
});
