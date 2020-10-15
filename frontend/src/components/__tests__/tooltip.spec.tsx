import React from "react";
import { render, baseIP } from "test-utils";
import { IP } from "types";
import { Tooltip } from "../Tooltip";

it("matches snapshot", () => {
  const { asFragment } = render(<Tooltip ip={baseIP} />);
  expect(asFragment()).toMatchSnapshot();
});

it("builds location comma-separated", () => {
  const ip: IP = {
    ...baseIP,
    country: { names: { en: "Orangeland" } },
    city: { names: { en: "City" } },
    continent: { names: { en: "Antarctica" } },
  };
  const { getByText } = render(<Tooltip ip={ip} />);
  expect(getByText("City, Orangeland, Antarctica")).toBeInTheDocument();
});

it("ignores empty location values", () => {
  const ip: IP = {
    ...baseIP,
    country: { names: { en: "" } },
    city: { names: { en: "City" } },
    continent: { names: { en: "Antarctica" } },
  };
  const { getByText } = render(<Tooltip ip={ip} />);
  expect(getByText("City, Antarctica")).toBeInTheDocument();
});

it("ignores undefined location values", () => {
  const ip: IP = {
    ...baseIP,
    country: { names: { en: undefined! } },
    city: { names: { en: undefined! } },
    continent: { names: { en: undefined! } },
  };
  const { queryByText } = render(<Tooltip ip={ip} />);
  expect(queryByText("Location")).not.toBeInTheDocument();
});

it("builds ip/cidr from adderss and network", () => {
  const ip: IP = {
    ...baseIP,
    traits: {
      ...baseIP.traits,
      ipAddress: "1.2.3.4",
      network: "0.0.0.0/19",
    },
  };
  const { getByText } = render(<Tooltip ip={ip} />);
  expect(getByText("1.2.3.4/19")).toBeInTheDocument();
});

it("handles empty network cidr", () => {
  const ip: IP = {
    ...baseIP,
    traits: {
      ...baseIP.traits,
      ipAddress: "1.2.3.4",
      network: "",
    },
  };
  const { getByText } = render(<Tooltip ip={ip} />);
  expect(getByText("1.2.3.4")).toBeInTheDocument();
});

it("handles no network info", () => {
  const ip: IP = {
    ...baseIP,
    traits: {
      ...baseIP.traits,
      ipAddress: "",
      network: "",
    },
  };
  const { queryByText } = render(<Tooltip ip={ip} />);
  expect(queryByText("Address")).not.toBeInTheDocument();
});

it("adds accuracy radius in km if available", () => {
  const ip: IP = {
    ...baseIP,
    location: {
      ...baseIP.location,
      accuracyRadius: 42,
    },
  };
  const { getByText } = render(<Tooltip ip={ip} />);
  expect(getByText("42km")).toBeInTheDocument();
});

it("excludes accuracy radius if unavailable", () => {
  const { accuracyRadius, ...rest } = baseIP.location;
  const ip: IP = {
    ...baseIP,
    location: {
      ...baseIP.location,
      accuracyRadius: undefined!,
    },
  };
  const { queryByText } = render(<Tooltip ip={ip} />);
  expect(queryByText("Accuracy")).not.toBeInTheDocument();
});

it("adds time zone if available", () => {
  const ip: IP = {
    ...baseIP,
    location: {
      ...baseIP.location,
      timeZone: "sometimezonedata",
    },
  };
  const { getByText } = render(<Tooltip ip={ip} />);
  expect(getByText("Time Zone")).toBeInTheDocument();
  expect(getByText("sometimezonedata")).toBeInTheDocument();
});

it("excludes accuracy radius if unavailable", () => {
  const { accuracyRadius, ...rest } = baseIP.location;
  const ip: IP = {
    ...baseIP,
    location: {
      ...baseIP.location,
      timeZone: undefined!,
    },
  };
  const { queryByText } = render(<Tooltip ip={ip} />);
  expect(queryByText("Time Zone")).not.toBeInTheDocument();
});
