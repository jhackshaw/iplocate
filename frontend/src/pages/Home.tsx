import React, { useState } from "react";
import styled from "styled-components";
import { CollapsableDialog, Map, CardHeader, IPForm } from "components";
import { IP } from "types";

export const Home: React.FC = (props) => {
  const [currentIp, setCurrentIp] = useState<IP>();

  const onSearchIP = (ip: string) => {
    setCurrentIp({
      address: ip,
      city: "Test",
      longitude: Math.random() * 90 - 45,
      latitude: Math.random() * 90 - 45,
    });
  };

  return (
    <Wrapper>
      <CollapsableDialog collapsed={!!currentIp}>
        <CardHeader>Locate IP Address</CardHeader>
        <IPForm onSubmit={(ip) => onSearchIP(ip)} />
      </CollapsableDialog>
      <Map selectedIP={currentIp} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex: 1;
  overflow-y: hidden;
  position: relative;
  width: 100%;
  height: 100%;
`;
