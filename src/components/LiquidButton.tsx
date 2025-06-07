import React, { ReactNode, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

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
    transform: scale(0.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
`;

const rippleAnimation = css`${ripple}`;

const waveAnimation = keyframes`
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const waveAnimationStyled = css`${waveAnimation}`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const pulseAnimation = css`${pulse}`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const shimmerAnimation = css`${shimmer}`;

const float = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
`;

const floatAnimation = css`${float}`;

const StyledWrapper = styled.div<{
  color: string;
  hoverColor: string;
  size: string;
  disabled: boolean;
  fullWidth?: boolean;
}>`
  display: ${props => props.fullWidth ? 'block' : 'inline-block'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin: 10px 0;
  
  .button {
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.15);
    outline: 0px;
    color: #fff;
    width: ${props => {
      if (props.fullWidth) return '100%';
      switch (props.size) {
        case 'small': return '120px';
        case 'large': return '240px';
        default: return '180px';
      }
    }};
    padding: ${props => {
      switch (props.size) {
        case 'small': return '12px 16px';
        case 'large': return '20px 32px';
        default: return '16px 24px';
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
    text-align: center;

    &:hover {
      transform: ${props => props.disabled ? 'none' : 'translateY(-3px) scale(1.02)'};
      box-shadow: ${props => props.disabled ? 'none' : '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(${props.color}, 0.3)'};
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
      transform: translate(-50%, -50%);
    }
    
    &:active::after {
      animation: ${props => css`${ripple} 0.6s ease-out;`};
    }
  }

  .liquid {
    background-color: ${props => props.color};
    width: 100%;
    height: 60%;
    position: absolute;
    bottom: 0;
    left: 0;
    box-shadow: inset 5px -5px 25px rgba(0, 0, 0, 0.3),
    inset -5px 0px 25px rgba(0, 0, 0, 0.3);
    transition: all 0.4s ease;
    
    &.hovered {
      background-color: ${props => props.hoverColor};
      height: 65%;
      animation: ${props => css`${pulse} 2s infinite;`};
    }
    
    &.pressed {
      height: 75%;
    }
  }

  .liquid::after {
    content: '';
    width: 450px;
    height: 400px;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1;
    position: absolute;
    left: -110px;
    top: -380px;
    border-radius: 45%;
    animation: ${props => css`${waveAnimation} 5s linear 2s infinite;`};
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
    animation: ${props => css`${waveAnimation} 5s linear 1.8s infinite;`};
  }

  .btn-txt {
    position: relative;
    z-index: 1;
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '0.9em';
        case 'large': return '1.2em';
        default: return '1em';
      }
    }};
    font-weight: 500;
    letter-spacing: 1px;
    background: ${props => !props.disabled ? 'linear-gradient(90deg, #ffffff, #f0f0f0, #ffffff)' : 'none'};
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: ${props => !props.disabled ? 'transparent' : 'white'};
    animation: ${props => !props.disabled ? css`${shimmer} 3s linear infinite` : 'none'};
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    .button {
      padding: ${props => {
        switch (props.size) {
          case 'small': return '10px 14px';
          case 'large': return '16px 28px';
          default: return '14px 20px';
        }
      }};
    }
    
    .btn-txt {
      font-size: ${props => {
        switch (props.size) {
          case 'small': return '0.8em';
          case 'large': return '1.1em';
          default: return '0.9em';
        }
      }};
    }
  }
  
  @media (max-width: 480px) {
    .button {
      padding: ${props => {
        switch (props.size) {
          case 'small': return '8px 12px';
          case 'large': return '14px 24px';
          default: return '12px 18px';
        }
      }};
      width: ${props => {
        if (props.fullWidth) return '100%';
        switch (props.size) {
          case 'small': return '100px';
          case 'large': return '200px';
          default: return '150px';
        }
      }};
    }
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 2;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;
`;

export default LiquidButton;