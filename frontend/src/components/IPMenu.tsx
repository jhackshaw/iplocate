import React from "react";
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import styled from "styled-components";
import { IP } from "types";

interface Props {
  ips: IP[];
  onSetCurrentIp(ip: IP): void;
  onRemoveIp(ip: IP): void;
  onToggleIpVisible(ip: IP): void;
}

export const IPMenu: React.FC<Props> = (props) => {
  const { ips, onSetCurrentIp, onToggleIpVisible, onRemoveIp } = props;

  if (ips.length === 0) return null;

  return (
    <Wrapper>
      {ips.map((ip) => (
        <Row key={ip.traits.ipAddress}>
          <RowText onClick={() => onSetCurrentIp(ip)}>
            {ip.traits.ipAddress}
          </RowText>
          <div>
            <RowAction
              onClick={() => onRemoveIp(ip)}
              aria-label="remove ip address"
            >
              <FaTrash />
            </RowAction>
            {ip.hidden ? (
              <RowAction
                onClick={() => onToggleIpVisible(ip)}
                aria-label="toggle ip visibility on"
              >
                <FaEye />
              </RowAction>
            ) : (
              <RowAction
                onClick={() => onToggleIpVisible(ip)}
                aria-label="toggle ip visibility off"
              >
                <FaEyeSlash />
              </RowAction>
            )}
          </div>
        </Row>
      ))}
    </Wrapper>
  );
};

const RowAction = styled.button`
  border-radius: 50%;
  flex: 0;
  width: 45px;
  height: 45px;
  font-size: 1.2rem;
  margin: 0 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const RowText = styled.button`
  display: block;
  background: none;
  text-align: left;
  font-size: 1.2rem;
  margin: 0;
  font-family: var(--font-family-mono);
  padding: 0.8rem 0;

  :hover {
    text-decoration: underline;
  }
`;

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

const Wrapper = styled.div`
  padding-top: 1rem;
  color: var(--text-primary);
  button {
    background: none;
    outline: none;
    border: none;
    cursor: pointer;
  }
`;
