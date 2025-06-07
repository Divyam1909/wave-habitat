import React from 'react';
import styled from 'styled-components';

const OceanBackground: React.FC = () => {
  return <Container />;
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: linear-gradient(to bottom, #041c2c, #0a2d4a);
`;

export default OceanBackground;