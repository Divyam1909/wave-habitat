import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPowerOff, faClock, faSun, faLightbulb, faMoon } from '@fortawesome/free-solid-svg-icons';

interface ControlCardProps {
  title: string;
  icon: 'lightbulb' | 'moon';
}

type Mode = 'off' | 'auto' | 'on';

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

const animate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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

const ControlCard: React.FC<ControlCardProps> = ({ title, icon }) => {
  const [mode, setMode] = useState<Mode>('off');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (mode === 'on') {
      setIsActive(true);
    } else if (mode === 'off') {
      setIsActive(false);
    }

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
          isActive={mode === 'on'}
          onClick={() => setMode('on')}
          variant="on"
        >
          <WaterEffect isActive={mode === 'on'} variant="on" />
          <ButtonContent>
            <FontAwesomeIcon icon={faSun} />
            <ButtonText>On</ButtonText>
          </ButtonContent>
        </Button>

        <Button
          isActive={mode === 'auto'}
          onClick={() => setMode('auto')}
          variant="auto"
          active={mode === 'auto' && isActive}
        >
          <WaterEffect isActive={mode === 'auto'} variant="auto" active={isActive} />
          <ButtonContent>
            <FontAwesomeIcon icon={faClock} />
            <ButtonText>Auto</ButtonText>
          </ButtonContent>
        </Button>

        <Button
          isActive={mode === 'off'}
          onClick={() => setMode('off')}
          variant="off"
        >
          <WaterEffect isActive={mode === 'off'} variant="off" />
          <ButtonContent>
            <FontAwesomeIcon icon={faPowerOff} />
            <ButtonText>Off</ButtonText>
          </ButtonContent>
        </Button>
      </ControlButtons>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 50px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${float} 6s ease-in-out infinite;
  width: 100%;
  max-width: 100%;
  margin: 0;

  @media (max-width: 768px) {
    padding: 30px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 20px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    margin-bottom: 25px;
  }
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

  @media (max-width: 768px) {
    gap: 10px;

    svg {
      font-size: 1.3em;
    }

    h2 {
      font-size: 1.2em;
    }
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 480px) {
    justify-content: center;
  }
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
  gap: 35px;
  width: 100%;
  padding: 20px 30px;
  margin: 0 auto;
  max-width: 1000px;

  @media (max-width: 768px) {
    gap: 20px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 10px;
  }
`;

interface ButtonProps {
  isActive: boolean;
  variant: 'off' | 'auto' | 'on';
  active?: boolean;
}

const WaterEffect = styled.div<{ isActive: boolean; variant?: 'off' | 'auto' | 'on'; active?: boolean }>`
  width: 100%;
  height: 70px;
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity 0.3s ease;
  
  background-color: ${props => {
    if (props.variant === 'auto') {
      return props.active ? '#2ecc71' : '#e74c3c';
    }
    switch (props.variant) {
      case 'off': return '#e74c3c';
      case 'on': return '#2ecc71';
      default: return '#2893eb';
    }
  }};
  
  box-shadow: ${props => {
    const color = props.variant === 'auto' 
      ? (props.active ? '#27ae60' : '#c0392b')
      : props.variant === 'off' 
        ? '#c0392b' 
        : props.variant === 'on' 
          ? '#27ae60' 
          : '#104e81';
    return `inset 5px -5px 25px ${color}, inset -5px 0px 25px ${color}`;
  }};

  &::after {
    content: '';
    width: 450px;
    height: 400px;
    background: #000;
    z-index: 1;
    position: absolute;
    left: -110px;
    top: -380px;
    border-radius: 45%;
    animation: ${animate} 5s linear 2s infinite;
  }

  &::before {
    content: '';
    width: 450px;
    height: 400px;
    background-color: ${props => {
      if (props.variant === 'auto') {
        return props.active ? 'rgba(46, 204, 113, 0.8)' : 'rgba(231, 76, 60, 0.8)';
      }
      switch (props.variant) {
        case 'off': return 'rgba(231, 76, 60, 0.8)';
        case 'on': return 'rgba(46, 204, 113, 0.8)';
        default: return 'rgba(68, 160, 235, 0.8)';
      }
    }};
    z-index: 1;
    position: absolute;
    left: -110px;
    top: -380px;
    border-radius: 40%;
    animation: ${animate} 5s linear 1.8s infinite;
  }
`;

const Button = styled.button<ButtonProps>`
  position: relative;
  background-color: #000;
  border: none;
  outline: none;
  color: white;
  width: 100%;
  min-width: 180px;
  padding: 25px;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  height: 110px;
  margin: 0 auto;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: 1.4em;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
`;

const ButtonText = styled.span`
  font-size: 1.1em;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  letter-spacing: 2px;
  font-family: sans-serif;
`;

export default ControlCard; 