import React from 'react';
import styled, { css, keyframes } from 'styled-components';

interface MetricsPanelProps {
  children?: React.ReactNode;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInAnimation = css`${fadeIn}`;

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeInAnimation} 0.5s ease-out forwards;
`;

const MetricsPanel: React.FC<MetricsPanelProps> = ({ children }) => {
  return (
    <PanelContainer>
      {children}
    </PanelContainer>
  );
};

export default MetricsPanel;