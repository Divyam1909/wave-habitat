import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { useUserMode } from '../contexts/UserModeContext';

const ModeToggleButton: React.FC = () => {
  const { mode, setMode } = useUserMode();

  const toggleMode = () => {
    setMode(mode === 'operator' ? 'viewer' : 'operator');
  };

  return (
    <ToggleButton onClick={toggleMode}>
      <FontAwesomeIcon icon={mode === 'operator' ? faUserCog : faUser} />
      <ModeText>{mode === 'operator' ? 'Operator' : 'Viewer'}</ModeText>
    </ToggleButton>
  );
};

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(14, 165, 233, 0.2);
  color: #4fc3f7;
  border: 1px solid rgba(14, 165, 233, 0.5);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    background: rgba(14, 165, 233, 0.3);
  }
  
  svg {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.8rem;
    
    svg {
      font-size: 0.9rem;
    }
  }
`;

const ModeText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

export default ModeToggleButton;