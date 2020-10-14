import React from "react";
import styled from "styled-components";

export const Footer: React.FC = () => (
  <Wrapper>
    <div>© 2020, Jeff Hackshaw</div>
    <MaxMindNotice>
      This product includes GeoLite2 data created by MaxMind, available from{" "}
      <a href="https://www.maxmind.com">https://www.maxmind.com</a>.
    </MaxMindNotice>
  </Wrapper>
);

const Wrapper = styled.footer`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--background-card);
`;

const MaxMindNotice = styled.div`
  max-width: 400px;
  color: var(--text-light);
  font-weight: 300;
  font-size: 0.8rem;

  a: {
    color: var(--text-secondary);
  }
`;
