import React, { useMemo } from "react";
import styled from "styled-components";
import { IP } from "types";
import { Card as C } from "./Card";

interface Props extends Partial<Omit<JSX.IntrinsicElements["div"], "ref">> {
  ip: IP;
}

export const Tooltip: React.FC<Props> = (props) => {
  const { ip, ...rest } = props;

  const data = useMemo(() => {
    const ret = [];

    const location = [
      ip.city.names?.en ?? "",
      ip.country.names?.en ?? "",
      ip.continent.names?.en ?? "",
    ]
      .filter(Boolean)
      .join(", ");

    const cidr = ip.traits.network ? ip.traits.network.split("/")[1] : "";
    const address = `${ip.traits.ipAddress}${cidr ? "/" : ""}${cidr}`;
    if (address) {
      ret.push({
        label: "IP",
        value: address,
      });
    }
    if (location) {
      ret.push({
        label: "Location",
        value: location,
      });
    }
    if (ip.location.accuracyRadius) {
      ret.push({
        label: "Accuracy",
        value: `${ip.location.accuracyRadius}km`,
      });
    }
    if (ip.location.timeZone) {
      ret.push({
        label: "Time Zone",
        value: ip.location.timeZone,
      });
    }
    return ret;
  }, [ip]);

  return (
    <Card {...rest}>
      <Details>
        {data.map(({ label, value }) => (
          <React.Fragment key={label}>
            <Label>{label}</Label>
            <Data>{value}</Data>
          </React.Fragment>
        ))}
      </Details>
    </Card>
  );
};

const Card = styled(C)`
  position: absolute;
  z-index: 50;
  min-width: 400px;
  box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
`;

const Label = styled.dt`
  display: block;
  margin: 0;
  padding-bottom: 0.5rem;
  width: 100%;
  font-weight: 600;
`;

const Data = styled.dd`
  display: block;
  margin: 0;
  padding-bottom: 1rem;
  width: 100%;
`;

const Details = styled.dl`
  margin: 0;
  padding: 0;
  color: var(--text-primary);

  ${Data}:last-of-type {
    padding-bottom: 0;
  }
`;
