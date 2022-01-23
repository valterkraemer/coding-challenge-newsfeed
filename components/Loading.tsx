import styled, { keyframes } from "styled-components";

type Loading = {
  show: boolean;
};

export default function Loading({ show }: Loading) {
  return (
    <Container>
      {show && (
        <Svg viewBox="0 0 8 2">
          <circle cx="1" cy="1" r="1"></circle>
          <circle cx="4" cy="1" r="1"></circle>
          <circle cx="7" cy="1" r="1"></circle>
        </Svg>
      )}
    </Container>
  );
}

const Container = styled.div`
  height: 3em;
  padding: 1em;
`;

const fade = keyframes`
  30%  {opacity: 1;}
  60%  {opacity: 0;}
`;

const Svg = styled.svg`
  display: block;
  height: 100%;
  margin: auto;

  fill: #a3a3a3;

  circle {
    opacity: 0;
    animation: ${fade} 1.5s infinite;
  }

  circle:nth-child(1) {
    animation-delay: -0.3s;
  }

  circle:nth-child(2) {
    animation-delay: -0.15s;
  }
`;
