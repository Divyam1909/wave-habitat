import React from 'react';
import styled from 'styled-components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface BackgroundAnimationProps {
  onLoad?: () => void;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ onLoad }) => {
  return (
    <Container>
      <DotLottieReact
        src="https://lottie.host/edad8b49-c879-4c09-8b8e-8a6341d10e60/IOg5DQufgw.lottie"
        style={{ width: '100%', height: '100%' }}
        loop
        autoplay
        onLoad={onLoad}
      />
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: rgba(4, 28, 44, 0.2);
`;

export default BackgroundAnimation; 