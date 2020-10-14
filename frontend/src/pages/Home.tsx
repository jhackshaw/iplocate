import React, { useState } from "react";
import styled from "styled-components";
import { CollapsableDialog, Input, CardHeader } from "components";

export const Home: React.FC = (props) => {
  const [collapsed, setcollapsed] = useState(false);

  return (
    <Wrapper>
      <button onClick={() => setcollapsed((c) => !c)}>test</button>
      <CollapsableDialog collapsed={collapsed}>
        <CardHeader>Locate IP Address</CardHeader>
        <Input placeholder="IP Address" />
      </CollapsableDialog>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex: 1 1 auto;
  width: 100%;
  background-color: var(--text-light);
`;
