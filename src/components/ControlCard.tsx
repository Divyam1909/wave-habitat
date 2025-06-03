import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPowerOff, faClock, faSun, faLightbulb, faMoon } from '@fortawesome/free-solid-svg-icons';

interface ControlCardProps {
  title: string;
  icon: 'lightbulb' | 'moon';
}

type Mode = 'off' | 'auto' | 'on';

const ControlCard: React.FC<ControlCardProps> = ({ title, icon }) => {
  const [mode, setMode] = useState<Mode>('off');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Update active status based on mode
    if (mode === 'on') {
      setIsActive(true);
    } else if (mode === 'off') {
      setIsActive(false);
    }

    // Handle auto mode switching
    let interval: NodeJS.Timeout;
    if (mode === 'auto') {
      interval = setInterval(() => {
        setIsActive(prev => !prev);
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode]);

  return (
    <CardContainer>
      <CardHeader>
        <TitleSection>
          <FontAwesomeIcon icon={icon === 'lightbulb' ? faLightbulb : faMoon} />
          <h2>{title}</h2>
        </TitleSection>
        <StatusIndicator>
          <StatusDot active={isActive} />
          <StatusText>{isActive ? 'Active' : 'Inactive'}</StatusText>
        </StatusIndicator>
        <SettingsButton>
          <FontAwesomeIcon icon={faCog} />
        </SettingsButton>
      </CardHeader>

      <ControlButtons>
        <Button
          isActive={mode === 'off'}
          onClick={() => setMode('off')}
          variant="off"
        >
          <WaterEffect isActive={mode === 'off'} />
          <ButtonContent>
            <FontAwesomeIcon icon={faPowerOff} />
            <ButtonText>Off</ButtonText>
          </ButtonContent>
        </Button>

        <Button
          isActive={mode === 'auto'}
          onClick={() => setMode('auto')}
          variant="auto"
        >
          <WaterEffect isActive={mode === 'auto'} />
          <ButtonContent>
            <FontAwesomeIcon icon={faClock} />
            <ButtonText>Auto</ButtonText>
          </ButtonContent>
        </Button>

        <Button
          isActive={mode === 'on'}
          onClick={() => setMode('on')}
          variant="on"
        >
          <WaterEffect isActive={mode === 'on'} />
          <ButtonContent>
            <FontAwesomeIcon icon={faSun} />
            <ButtonText>On</ButtonText>
          </ButtonContent>
        </Button>
      </ControlButtons>
    </CardContainer>
  );
};

const ripple = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(0, 195, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 195, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(0, 195, 255, 0.5);
  }
`;

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${float} 6s ease-in-out infinite;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  svg {
    font-size: 1.5em;
    color: #00c3ff;
  }

  h2 {
    font-size: 1.3em;
    font-weight: 500;
    color: white;
    margin: 0;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ active }) => active ? '#44ff44' : '#ff4444'};
  box-shadow: ${({ active }) => active ? '0 0 10px #44ff44' : '0 0 10px #ff4444'};
  transition: all 0.3s ease;
`;

const StatusText = styled.span`
  font-size: 0.9em;
  color: #fff;
  opacity: 0.8;
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: #ffffff80;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;

  &:hover {
    color: #fff;
    animation: ${glow} 2s ease-in-out infinite;
  }
`;

const ControlButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

interface ButtonProps {
  isActive: boolean;
  variant: 'off' | 'auto' | 'on';
}

const WaterEffect = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  border-radius: 15px;
  opacity: ${props => props.isActive ? 1 : 0};
  animation: ${ripple} 2s ease-in-out infinite;
  pointer-events: none;
  mix-blend-mode: overlay;
`;

const Button = styled.button<ButtonProps>`
  position: relative;
  background: ${props => {
    if (props.isActive) {
      switch (props.variant) {
        case 'off': return 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
        case 'auto': return 'linear-gradient(135deg, #44ff44 0%, #00cc00 100%)';
        case 'on': return 'linear-gradient(135deg, #44ff44 0%, #00cc00 100%)';
      }
    } else {
      // When inactive
      switch (props.variant) {
        case 'auto': return 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
        default: return 'rgba(0, 0, 0, 0.5)';
      }
    }
    return 'rgba(0, 0, 0, 0.5)';
  }};
  border: none;
  border-radius: 15px;
  padding: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  backdrop-filter: blur(5px);
  overflow: hidden;
  transform-origin: center;
  box-shadow: ${props => props.isActive ? 
    '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3)' : 
    '0 2px 8px rgba(0, 0, 0, 0.2)'};

  &:hover {
    transform: scale(1.05);
    animation: ${glow} 2s ease-in-out infinite;
    background: ${props => {
      if (props.isActive) {
        switch (props.variant) {
          case 'off': return 'linear-gradient(135deg, #ff6666 0%, #ff0000 100%)';
          case 'auto': return 'linear-gradient(135deg, #66ff66 0%, #00ff00 100%)';
          case 'on': return 'linear-gradient(135deg, #66ff66 0%, #00ff00 100%)';
          default: return 'rgba(0, 0, 0, 0.6)';
        }
      } else {
        // Hover state when inactive
        switch (props.variant) {
          case 'auto': return 'linear-gradient(135deg, #ff6666 0%, #ff0000 100%)';
          default: return 'rgba(0, 0, 0, 0.6)';
        }
      }
    }};
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 1em;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
`;

const ButtonText = styled.span`
  font-size: 0.9em;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
`;

export default ControlCard; 