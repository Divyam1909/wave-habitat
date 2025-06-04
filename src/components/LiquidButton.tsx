import React, { ReactNode, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface LiquidButtonProps {
  text?: ReactNode;
  onClick?: () => void;
  className?: string;
  color?: string;
  hoverColor?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const LiquidButton: React.FC<LiquidButtonProps> = ({ 
  text = "Click Me", 
  onClick,
  className,
  color = "#2893eb",
  hoverColor = "#44a0eb",
  size = "medium",
  disabled = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <StyledWrapper 
      className={className}
      color={color}
      hoverColor={hoverColor}
      size={size}
      disabled={disabled}
    >
      <button 
        className="button" 
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        disabled={disabled}
      >
        <span className={`liquid ${isHovered ? 'hovered' : ''} ${isPressed ? 'pressed' : ''}`} />  
        <span className="btn-txt">{text}</span>
      </button>
    </StyledWrapper>
  );
}

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;

const waveAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const StyledWrapper = styled.div<{
  color: string;
  hoverColor: string;
  size: string;
  disabled: boolean;
}>`
  .button {
    background-color: #000;
    border: 1px solid rgba(255, 255, 255, 0.1);
    outline: 0px;
    color: #fff;
    width: ${props => {
      switch (props.size) {
        case 'small': return '120px';
        case 'large': return '240px';
        default: return '180px';
      }
    }};
    padding: ${props => {
      switch (props.size) {
        case 'small': return '12px';
        case 'large': return '24px';
        default: return '18px';
      }
    }};
    border-radius: 50px;
    position: relative;
    overflow: hidden;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    opacity: ${props => props.disabled ? 0.6 : 1};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);

    &:hover {
      transform: ${props => props.disabled ? 'none' : 'translateY(-3px) scale(1.02)'};
      box-shadow: ${props => props.disabled ? 'none' : '0 8px 25px rgba(0, 0, 0, 0.3)'};
    }
    
    &:active {
      transform: ${props => props.disabled ? 'none' : 'translateY(1px) scale(0.98)'};
    }
    
    &::after {
      content: '';
      display: ${props => props.disabled ? 'none' : 'block'};
      position: absolute;
      width: 30px;
      height: 30px;
      top: 50%;
      left: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      opacity: 0;
      border-radius: 100%;
      transform: scale(1);
      transform: translate(-50%, -50%);
    }
    
    &:active::after {
      animation: ${ripple} 0.6s ease-out;
    }
  }

  .liquid {
    background-color: ${props => props.color};
    width: 100%;
    height: 70px;
    position: absolute;
    bottom: 0;
    left: 0;
    box-shadow: inset 5px -5px 25px rgba(0, 0, 0, 0.3),
    inset -5px 0px 25px rgba(0, 0, 0, 0.3);
    transition: all 0.4s ease;
    
    &.hovered {
      background-color: ${props => props.hoverColor};
      height: 75px;
      animation: ${pulse} 2s infinite;
    }
    
    &.pressed {
      height: 85px;
    }
  }

  .liquid::after {
    content: '';
    width: 450px;
    height: 400px;
    background: #000;
    z-index: 1;
    position: absolute;
    left: -110px;
    top: -380px;
    border-radius: 45%;
    animation: ${waveAnimation} 5s linear 2s infinite;
  }

  .liquid::before {
    content: '';
    width: 450px;
    height: 400px;
    background-color: ${props => props.hoverColor};
    z-index: 1;
    position: absolute;
    left: -110px;
    top: -380px;
    border-radius: 40%;
    animation: ${waveAnimation} 5s linear 1.8s infinite;
  }

  .btn-txt {
    position: relative;
    z-index: 1;
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '16px';
        case 'large': return '24px';
        default: return '20px';
      }
    }};
    font-weight: 500;
    font-family: sans-serif;
    letter-spacing: 2px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

export default LiquidButton;