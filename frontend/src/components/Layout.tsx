import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Footer } from "./Footer";

export const Layout: React.FC = (props) => {
  const { children } = props;

  return (
    <>
      <Global />
      <Wrapper>
        <Content>{children}</Content>
        <Footer />
      </Wrapper>
    </>
  );
};

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html, body {
    padding: 0;
    margin: 0;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;
  font-family: var(--font-family);
`;

const Content = styled.div`
  flex: 1 1 auto;
  background-color: var(--background-main);
`;
