import styled from "styled-components";

export const Card = styled.div`
  padding: 2rem 1rem;
  margin: 0;
  border-radius: 5px;
  background-color: var(--background-card);

  @media screen and (max-width: 450px) {
    padding: 1rem;
  }
`;

export const CardHeader = styled.h2`
  margin: 0;
  padding: 0;
  color: var(--text-primary);
  font-size: 1.8rem;
`;
