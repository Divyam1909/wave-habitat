import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinAnimation = spin;

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const rippleAnimation = css`${ripple}`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 195, 255, 0.1);
  border-radius: 50%;
  border-top: 4px solid rgba(0, 195, 255, 0.8);
  animation: ${props => css`${spin} 1s linear infinite;`};
  position: relative;
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: rgba(0, 195, 255, 0.3);
  }
  
  &:before {
    width: 70px;
    height: 70px;
    animation: ${props => css`${ripple} 2s ease-out infinite;`};
  }
  
  &:after {
    width: 60px;
    height: 60px;
    animation: ${props => css`${ripple} 2s ease-out infinite 0.5s;`};
  }
`;

const LoadingSpinner: React.FC = () => {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;