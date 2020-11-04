import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "./Input";
import { FaSearch } from "react-icons/fa";

interface Props {
  onSubmit(value: string): void;
}

// basic validation here, better validation on backend with ajv
// const ipRE = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const validateIp = (ip: string) => {
  return !!ip;
};

export const IPForm: React.FC<Props> = (props) => {
  const { onSubmit } = props;
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!validateIp(value)) {
      setError(true);
    } else {
      onSubmit(value);
      setValue("");
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.currentTarget.value);
    setError(false);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} error={error}>
        <Input
          value={value}
          onChange={handleChange}
          placeholder="IP Address"
          aria-label="IP Address input"
        />
        <button type="submit" aria-label="Search IP Address">
          <FaSearch />
        </button>
      </Form>
      {error && <ErrorMessage>Invalid IP Address.</ErrorMessage>}
    </>
  );
};

const Form = styled.form<{ error: boolean }>`
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  justify-content: stretch;

  ${Input} {
    flex: 1 1 auto;
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-color: ${(props) =>
      props.error ? "var(--text-error)" : "var(--text-lighter)"};
  }

  ${Input}:focus {
    outline: none;
    border-color: ${(props) =>
      props.error ? "var(--text-error)" : "var(--text-secondary)"};
    border-right: none;
  }

  button {
    flex: 0 0 auto;
    border: none;
    outline: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background: var(--text-secondary);
    display: flex;
    align-items: center;
    padding: 0 1.2rem;
    font-size: 18px;
    color: #fff;
    cursor: pointer;

    svg {
      display: block;
    }
  }
`;

const ErrorMessage = styled.p`
  color: var(--text-error);
  margin: 0;
  padding: 0.5rem 0 0 0;
`;
