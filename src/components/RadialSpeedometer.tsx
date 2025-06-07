import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

interface RadialSpeedometerProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  title?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  isLive?: boolean;
  isPaused?: boolean;
}

const RadialSpeedometer: React.FC<RadialSpeedometerProps> = ({
  value,
  min,
  max,
  unit,
  title,
  color = '#00c3ff',
  size = 'medium',
  className,
  isLive = false,
  isPaused = false
}) => {
  // State for animated value
  const [displayValue, setDisplayValue] = useState(value);
  
  // Smoothly animate to new value when it changes
  useEffect(() => {
    if (!isPaused) {
      setDisplayValue(value);
    }
  }, [value, isPaused]);
  
  // Calculate the percentage of the value within the range
  const percentage = Math.min(Math.max(((displayValue - min) / (max - min)) * 100, 0), 100);
  
  // Calculate the angle for the needle
  const angle = (percentage * 180) / 100 - 90;
  
  // Determine the color based on the percentage
  const getColor = () => {
    if (percentage < 25) return '#44ff44';
    if (percentage < 75) return '#ffaa00';
    return '#ff4444';
  };
  
  const actualColor = color === 'auto' ? getColor() : color;
  
  // Generate tick marks
  const ticks = [];
  const numTicks = 10;
  
  for (let i = 0; i <= numTicks; i++) {
    const tickAngle = (i * 180) / numTicks - 90;
    const isMajor = i % 2 === 0;
    const tickValue = min + (i / numTicks) * (max - min);
    
    ticks.push(
      <Tick 
        key={i} 
        angle={tickAngle} 
        isMajor={isMajor}
        size={size}
      >
        {isMajor && (
          <TickLabel angle={tickAngle} size={size}>
            {tickValue.toFixed(1)}
          </TickLabel>
        )}
      </Tick>
    );
  }

  return (
    <Container className={className} size={size}>
      {title && <Title size={size}>{title}</Title>}
      
      <GaugeContainer>
        <GaugeBackground>
          <GaugeArc>
            {ticks}
            <GaugeFill percentage={percentage} color={actualColor} />
          </GaugeArc>
          
          <NeedleContainer angle={angle}>
            <Needle color={actualColor} size={size} />
            <NeedleCenter color={actualColor} size={size} />
          </NeedleContainer>
          
          <ValueDisplay>
            <CurrentValue size={size}>{displayValue.toFixed(1)}</CurrentValue>
            <UnitText size={size}>{unit}</UnitText>
            {isLive && (
              <LiveStatus isPaused={isPaused}>
                {isPaused ? 'PAUSED' : 'LIVE'}
              </LiveStatus>
            )}
          </ValueDisplay>
          
          <MinMaxLabels>
            <MinLabel size={size}>{min.toFixed(1)}</MinLabel>
            <MaxLabel size={size}>{max.toFixed(1)}</MaxLabel>
          </MinMaxLabels>
        </GaugeBackground>
      </GaugeContainer>
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const fadeInAnimation = css`${fadeIn}`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const pulseAnimation = css`${pulse}`;

const scalePulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const getSizeValue = (size: string, small: string, medium: string, large: string) => {
  switch (size) {
    case 'small': return small;
    case 'large': return large;
    default: return medium;
  }
};

const Container = styled.div<{ size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ size }) => getSizeValue(size, '120px', '180px', '240px')};
  animation: ${props => css`${fadeIn} 0.5s ease-out forwards;`};
`;

const Title = styled.h4<{ size: string }>`
  font-size: ${({ size }) => getSizeValue(size, '0.8rem', '1rem', '1.2rem')};
  font-weight: 500;
  margin: 0 0 10px 0;
  color: white;
  text-align: center;
`;

const GaugeContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 10px;
`;

const GaugeBackground = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  overflow: visible;
`;

const GaugeArc = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  overflow: hidden;
`;

const GaugeFill = styled.div<{ percentage: number; color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  border-radius: 50%;
  background: linear-gradient(to right, 
    rgba(0, 0, 0, 0) 50%, 
    ${props => props.color}40 50%, 
    ${props => props.color}40 ${props => 50 + props.percentage / 2}%, 
    rgba(0, 0, 0, 0) ${props => 50 + props.percentage / 2}%
  );
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  transition: all 0.5s ease;
`;

const Tick = styled.div<{ angle: number; isMajor: boolean; size: string }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: ${props => props.isMajor ? '2px' : '1px'};
  height: ${props => props.isMajor ? 
    getSizeValue(props.size, '10px', '15px', '20px') : 
    getSizeValue(props.size, '5px', '8px', '12px')
  };
  background-color: rgba(255, 255, 255, ${props => props.isMajor ? 0.8 : 0.4});
  transform-origin: bottom center;
  transform: translateX(-50%) rotate(${props => props.angle}deg);
`;

const TickLabel = styled.div<{ angle: number; size: string }>`
  position: absolute;
  top: ${({ size }) => getSizeValue(size, '-20px', '-25px', '-30px')};
  left: 50%;
  transform: translateX(-50%) rotate(${props => -props.angle}deg);
  font-size: ${({ size }) => getSizeValue(size, '0.6rem', '0.7rem', '0.8rem')};
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
`;

const NeedleContainer = styled.div<{ angle: number }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  transform-origin: center top;
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const Needle = styled.div<{ color: string; size: string }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: ${({ size }) => getSizeValue(size, '60px', '90px', '120px')};
  background-color: ${props => props.color};
  transform: translateX(-50%);
  transform-origin: top center;
  box-shadow: 0 0 10px ${props => props.color};
  z-index: 2;
`;

const NeedleCenter = styled.div<{ color: string; size: string }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: ${({ size }) => getSizeValue(size, '10px', '14px', '18px')};
  height: ${({ size }) => getSizeValue(size, '10px', '14px', '18px')};
  background-color: ${props => props.color};
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px ${props => props.color}, inset 0 0 5px rgba(0, 0, 0, 0.5);
  z-index: 3;
  animation: ${props => css`${pulse} 2s ease-in-out infinite;`};
`;

const ValueDisplay = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const LiveStatus = styled.div<{ isPaused: boolean }>`
  font-size: 0.6rem;
  font-weight: bold;
  color: ${props => props.isPaused ? '#e74c3c' : '#2ecc71'};
  background: ${props => props.isPaused ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.2)'};
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 5px;
  animation: ${props => props.isPaused ? 'none' : css`${pulse} 2s infinite;`};
`;

const CurrentValue = styled.div<{ size: string }>`
  font-size: ${({ size }) => getSizeValue(size, '1.2rem', '1.5rem', '2rem')};
  font-weight: 600;
  color: white;
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.8);
`;

const UnitText = styled.div<{ size: string }>`
  font-size: ${({ size }) => getSizeValue(size, '0.7rem', '0.8rem', '1rem')};
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
`;

const MinMaxLabels = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 5%;
`;

const MinLabel = styled.div<{ size: string }>`
  font-size: ${({ size }) => getSizeValue(size, '0.6rem', '0.7rem', '0.8rem')};
  color: rgba(255, 255, 255, 0.6);
`;

const MaxLabel = styled.div<{ size: string }>`
  font-size: ${({ size }) => getSizeValue(size, '0.6rem', '0.7rem', '0.8rem')};
  color: rgba(255, 255, 255, 0.6);
`;

export default RadialSpeedometer;