import React, { useState } from 'react';
import styled from 'styled-components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface BackgroundAnimationProps {
  onLoad?: () => void;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ onLoad }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.error('Failed to load Lottie animation');
    setHasError(true);
  };

  return (
    <Container>
      {!hasError && (
        <DotLottieReact
          src="https://lottie.host/edad8b49-c879-4c09-8b8e-8a6341d10e60/IOg5DQufgw.lottie"
          style={{ width: '100%', height: '100%' }}
          loop
          autoplay
          onLoad={onLoad}
          onError={handleError}
        />
      )}
      <FallbackBackground />
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(4, 28, 44, 0.2);
`;

const FallbackBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a1a2f 0%, #0d2b4a 100%);
  z-index: -1;
`;

export default BackgroundAnimation;