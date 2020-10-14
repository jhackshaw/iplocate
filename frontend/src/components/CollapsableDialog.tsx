import React from "react";
import styled, { keyframes } from "styled-components";
import { Card } from "./Card";

interface Props {
  collapsed: boolean;
}

export const CollapsableDialog: React.FC<Props> = (props) => {
  const { collapsed, children } = props;

  return (
    <Wrapper collapsed={collapsed}>
      <Card>{children}</Card>
    </Wrapper>
  );
};

const Wrapper = styled.div<Props>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;

  ${Card} {
    z-index: 1000;
    position: absolute;
    min-width: 400px;
    top: ${(props) => (props.collapsed ? "10px" : "50%")};
    left: ${(props) => (props.collapsed ? "10px" : "50%")};
    transform: ${(props) =>
      props.collapsed ? "" : "translateX(-50%) translateY(-50%)"};
    transition: transform 1s ease, top 1s ease, left 1s ease;
  }
`;
