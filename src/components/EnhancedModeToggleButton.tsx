import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCog, faCode } from '@fortawesome/free-solid-svg-icons';
import { useUserMode } from '../contexts/UserModeContext';

const EnhancedModeToggleButton: React.FC = () => {
  const { mode, setMode } = useUserMode();

  const toggleMode = () => {
    // Cycle through the three modes: viewer -> operator -> programmer -> viewer
    if (mode === 'viewer') {
      setMode('operator');
    } else if (mode === 'operator') {
      setMode('programmer');
    } else {
      setMode('viewer');
    }
  };

  // Get the appropriate icon and next mode for the button
  const getIconForMode = () => {
    switch (mode) {
      case 'viewer': return faUser;
      case 'operator': return faUserCog;
      case 'programmer': return faCode;
      default: return faUser;
    }
  };

  // Get the appropriate text for the current mode
  const getTextForMode = () => {
    switch (mode) {
      case 'viewer': return 'Viewer';
      case 'operator': return 'Operator';
      case 'programmer': return 'Programmer';
      default: return 'Viewer';
    }
  };

  return (
    <ToggleButton 
      onClick={toggleMode} 
      aria-label={`Current mode: ${getTextForMode()}`}
    >
      <ButtonContent>
        <IconWrapper isProgrammer={mode === 'programmer'} isOperator={mode === 'operator'}>
          <FontAwesomeIcon icon={getIconForMode()} />
        </IconWrapper>
        <ModeText>{getTextForMode()}</ModeText>
      </ButtonContent>
      
      <ButtonBackground isProgrammer={mode === 'programmer'} isOperator={mode === 'operator'} />
    </ToggleButton>
  );
};

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ToggleButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  width: 120px;
  height: 40px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

const ButtonBackground = styled.div<{ isOperator: boolean; isProgrammer: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => {
    if (props.isProgrammer) {
      return 'linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(233, 30, 99, 0.2))';
    } else if (props.isOperator) {
      return 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(79, 195, 247, 0.2))';
    } else {
      return 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
    }
  }};
  border: 1px solid ${props => {
    if (props.isProgrammer) {
      return 'rgba(156, 39, 176, 0.5)';
    } else if (props.isOperator) {
      return 'rgba(14, 165, 233, 0.5)';
    } else {
      return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  border-radius: 20px;
  z-index: 0;
  transition: all 0.3s ease;
  animation: ${props => {
    if (props.isProgrammer) {
      return css`${pulse} 2s infinite`;
    } else if (props.isOperator) {
      return css`${pulse} 2s infinite`;
    } else {
      return 'none';
    }
  }};
  
  @media (max-width: 768px) {
    border-radius: 50%;
  }
`;

const ButtonContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1;
  padding: 0 15px;
  
  @media (max-width: 768px) {
    padding: 0;
    justify-content: center;
  }
`;

const IconWrapper = styled.div<{ isOperator: boolean; isProgrammer: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    if (props.isProgrammer) {
      return '#e91e63';
    } else if (props.isOperator) {
      return '#4fc3f7';
    } else {
      return 'rgba(255, 255, 255, 0.8)';
    }
  }};
  font-size: 1rem;
  transition: all 0.3s ease;
  animation: ${props => {
    if (props.isProgrammer) {
      return css`${rotate} 1s ease-in-out`;
    } else if (props.isOperator) {
      return css`${rotate} 1s ease-in-out`;
    } else {
      return css`${fadeIn} 0.3s ease-out`;
    }
  }};
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ModeText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export default EnhancedModeToggleButton;