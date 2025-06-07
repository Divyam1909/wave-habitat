import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const Bubbles: React.FC = () => {
  return (
    <BubblesContainer>
      {[...Array(18)].map((_, index) => (
        <Bubble key={index} index={index} />
      ))}
    </BubblesContainer>
  );
};

const rise = keyframes`
  0% {
    bottom: -100px;
    transform: translateX(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateX(100px) scale(1.1);
    opacity: 0.8;
  }
  100% {
    bottom: 1080px;
    transform: translateX(-20px) scale(0.8);
    opacity: 0;
  }
`;

const riseAnimation = css`${rise}`;

const BubblesContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: hidden;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const Bubble = styled.div<{ index: number }>`
  position: absolute;
  bottom: -100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  opacity: 0.5;
  animation: ${rise} ${props => 5 + (props.index % 6)}s infinite ease-in;
  animation-delay: ${props => (props.index * 0.5)}s;
  left: ${props => (5 + props.index * 5)}%;
  width: ${props => 10 + (props.index % 20)}px;
  height: ${props => 10 + (props.index % 20)}px;
`;

export default Bubbles;