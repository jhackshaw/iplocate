import React from "react";
import styled from "styled-components";
import { Card, CardHeader } from "./Card";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Props {
  collapsed: boolean;
  menuExpanded: boolean;
  setMenuExpanded(exp: boolean): void;
  title: string;
}

export const CollapsableDialog: React.FC<Props> = (props) => {
  const { title, menuExpanded, setMenuExpanded, children } = props;

  return (
    <Wrapper {...props}>
      <Card>
        <ExpandHeader
          aria-label="toggle menu expanded"
          onClick={() => setMenuExpanded(!menuExpanded)}
        >
          <CardHeader>{title}</CardHeader>
          <ExpandIcon>
            {menuExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </ExpandIcon>
        </ExpandHeader>
        {menuExpanded && <Collapse>{children}</Collapse>}
      </Card>
    </Wrapper>
  );
};

const ExpandIcon = styled.span`
  border-radius: 50%;
  display: block;
  margin-left: 0.5rem;
  font-size: 1.2rem;
`;

const Collapse = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-top: "1rem";
`;

const ExpandHeader = styled.button`
  background: none;
  cursor: pointer;
  outline: none;
  border: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div<Props>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;

  ${Card} {
    z-index: 1000;
    position: absolute;
    min-width: 400px;
    max-height: 70vh;
    display: flex;
    flex-flow: column nowrap;
    top: ${(props) => (props.collapsed ? "10px" : "50%")};
    left: ${(props) => (props.collapsed ? "10px" : "50%")};
    transform: ${(props) =>
      props.collapsed ? "" : "translateX(-50%) translateY(-50%)"};
    transition: transform 1s ease, top 1s ease, left 1s ease;
    box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
      0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);

    @media screen and (max-width: 450px) {
      min-width: unset;
      top: 10px;
      left: 10px;
      right: 10px;
      transform: unset;
    }
  }

  ${Collapse} {
    scrollbar-width: 0;
    -ms-overflow-style: none;
  }
  ${Collapse}::-webkit-scrollbar {
    display: none;
  }
`;
