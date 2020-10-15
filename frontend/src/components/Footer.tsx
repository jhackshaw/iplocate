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

  @media screen and (max-width: 450px) {
    flex-flow: column nowrap;
    align-items: flex-start;
    padding: 1rem;
  }
`;

const MaxMindNotice = styled.div`
  color: var(--text-light);
  font-weight: 300;
  font-size: 0.7rem;
  text-align: right;
  padding-top: 1rem;

  @media screen and (max-width: 450px) {
    text-align: left;
  }

  a: {
    color: var(--text-secondary);
  }
`;
