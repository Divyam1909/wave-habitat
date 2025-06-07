import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { useUserMode } from '../contexts/UserModeContext';

const EnhancedModeToggleButton: React.FC = () => {
  const { mode, setMode } = useUserMode();

  const toggleMode = () => {
    setMode(mode === 'operator' ? 'viewer' : 'operator');
  };

  return (
    <ToggleButton onClick={toggleMode} aria-label={`Switch to ${mode === 'operator' ? 'viewer' : 'operator'} mode`}>
      <ButtonContent>
        <IconWrapper isOperator={mode === 'operator'}>
          <FontAwesomeIcon icon={mode === 'operator' ? faUserCog : faUser} />
        </IconWrapper>
        <ModeText>{mode === 'operator' ? 'Operator' : 'Viewer'}</ModeText>
      </ButtonContent>
      
      <ButtonBackground isOperator={mode === 'operator'} />
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

const ButtonBackground = styled.div<{ isOperator: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.isOperator ? 
    'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(79, 195, 247, 0.2))' : 
    'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
  };
  border: 1px solid ${props => props.isOperator ? 
    'rgba(14, 165, 233, 0.5)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 20px;
  z-index: 0;
  transition: all 0.3s ease;
  animation: ${props => props.isOperator ? css`${pulse} 2s infinite` : 'none'};
  
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

const IconWrapper = styled.div<{ isOperator: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isOperator ? '#4fc3f7' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 1rem;
  transition: all 0.3s ease;
  animation: ${props => props.isOperator ? css`${rotate} 1s ease-in-out` : css`${fadeIn} 0.3s ease-out`};
  
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