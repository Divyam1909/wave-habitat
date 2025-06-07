import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faWater, faTemperatureHalf, faLeaf, faLightbulb, faInfoCircle, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import RadialSpeedometer from './RadialSpeedometer';

interface ChartData {
  time: string;
  value: number;
}

interface MetricCardProps {
  title: string;
  icon: 'water' | 'temperature' | 'ph' | 'oxygen' | 'light';
  currentValue: number;
  unit: string;
  minValue: number;
  maxValue: number;
  chartData: ChartData[];
  isLive?: boolean;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  className?: string;
  updateInterval?: number; // Interval in ms for live updates
  varianceRange?: number; // Range of random variance for live data
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon,
  currentValue: initialValue,
  unit,
  minValue,
  maxValue,
  chartData: initialChartData,
  isLive = true, // Default to live now
  trend = 'stable',
  color = '#00c3ff',
  className,
  updateInterval = 2000, // Update every 2 seconds by default
  varianceRange = 1.0 // Default variance range
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState<{ time: string; value: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // State for live data
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [chartData, setChartData] = useState(initialChartData);
  const [isPaused, setIsPaused] = useState(false);
  
  // Ref for the interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Effect for live data updates
  useEffect(() => {
    // Only set up the interval if isLive is true and not paused
    if (isLive && !isPaused) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up new interval for updating data
      intervalRef.current = setInterval(() => {
        // Generate a new value with random variance
        const randomVariance = (Math.random() * 2 - 1) * varianceRange;
        const newValue = Math.max(minValue, Math.min(maxValue, currentValue + randomVariance));
        setCurrentValue(newValue);
        
        // Create a new data point
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Add the new data point and remove the oldest if needed
        setChartData(prevData => {
          const newData = [...prevData, { time: timeString, value: newValue }];
          // Keep only the last 24 data points
          if (newData.length > 24) {
            return newData.slice(newData.length - 24);
          }
          return newData;
        });
      }, updateInterval);
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, isPaused, currentValue, minValue, maxValue, varianceRange, updateInterval]);
  
  // Toggle pause/play
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Get the appropriate icon based on the icon prop
  const getIcon = (): IconDefinition => {
    switch (icon) {
      case 'water': return faWater;
      case 'temperature': return faTemperatureHalf;
      case 'ph': return faLeaf;
      case 'oxygen': return faLeaf;
      case 'light': return faLightbulb;
      default: return faWater;
    }
  };

  // Handle mouse movement over the chart
  const handleChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const chartRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - chartRect.left;
    const y = e.clientY - chartRect.top;
    
    // Calculate which data point is closest to the mouse position
    const index = Math.floor((x / chartRect.width) * chartData.length);
    if (index >= 0 && index < chartData.length) {
      setTooltipData(chartData[index]);
      setTooltipPosition({ x, y });
      setShowTooltip(true);
    }
  };

  // Handle mouse leave from the chart
  const handleChartMouseLeave = () => {
    setShowTooltip(false);
  };

  // Render the chart based on the data
  const renderChart = () => {
    if (!chartData || chartData.length === 0) return null;
    
    const maxDataValue = Math.max(...chartData.map(d => d.value));
    const minDataValue = Math.min(...chartData.map(d => d.value));
    const range = maxDataValue - minDataValue;
    
    return chartData.map((point, index) => {
      const height = range === 0 ? 50 : ((point.value - minDataValue) / range) * 80;
      return (
        <ChartBar 
          key={index}
          style={{ height: `${height}%` }}
          color={color}
        />
      );
    });
  };

  return (
    <CardContainer className={className}>
      <CardHeader>
        <TitleSection>
          <IconContainer color={color}>
            <MetricIcon icon={getIcon()} />
          </IconContainer>
          <div>
            <CardTitle>{title}</CardTitle>
            {isLive && (
              <LiveIndicator>
                <LiveDot />
                <LiveText>{isPaused ? 'PAUSED' : 'LIVE'}</LiveText>
              </LiveIndicator>
            )}
          </div>
        </TitleSection>
        <HeaderControls>
          {isLive && (
            <PauseButton onClick={togglePause} isPaused={isPaused}>
              <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
            </PauseButton>
          )}
          <InfoIcon icon={faInfoCircle} />
        </HeaderControls>
      </CardHeader>
      
      <CardContent>
        <MetricSection>
          <CurrentValueContainer>
            <CurrentValue color={color}>{currentValue.toFixed(1)}</CurrentValue>
            <UnitText>{unit}</UnitText>
            {trend !== 'stable' && (
              <TrendIndicator trend={trend}>
                {trend === 'up' ? '↑' : '↓'}
              </TrendIndicator>
            )}
          </CurrentValueContainer>
          
          <MinMaxContainer>
            <MinMaxItem>
              <MinMaxLabel>Min</MinMaxLabel>
              <MinMaxValue>{minValue.toFixed(1)}</MinMaxValue>
            </MinMaxItem>
            <MinMaxItem>
              <MinMaxLabel>Max</MinMaxLabel>
              <MinMaxValue>{maxValue.toFixed(1)}</MinMaxValue>
            </MinMaxItem>
          </MinMaxContainer>
        </MetricSection>
        
        <ChartSection>
          <RadialSpeedometer 
            value={currentValue}
            min={minValue}
            max={maxValue}
            unit={unit}
            color={color}
            size="medium"
          />
          
          <ChartWrapper 
            onMouseMove={handleChartMouseMove}
            onMouseLeave={handleChartMouseLeave}
          >
            <ChartContainer>
              {renderChart()}
            </ChartContainer>
            
            {showTooltip && tooltipData && (
              <TooltipContainer 
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y - 70}px`
                }}
              >
                <TooltipTime>{tooltipData.time}</TooltipTime>
                <TooltipRow>
                  <TooltipLabel>{title}:</TooltipLabel>
                  <TooltipValue color={color}>
                    {tooltipData.value.toFixed(1)} {unit}
                  </TooltipValue>
                </TooltipRow>
              </TooltipContainer>
            )}
          </ChartWrapper>
        </ChartSection>
      </CardContent>
    </CardContainer>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInAnimation = css`${fadeIn}`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const floatAnimation = css`${float}`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const pulseAnimation = css`${pulse}`;

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const shimmerAnimation = css`${shimmer}`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const blinkAnimation = css`${blink}`;

const CardContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out forwards;
  overflow: hidden;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const IconContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => `${props.color}20`};
  box-shadow: 0 0 15px ${props => `${props.color}40`};
  animation: ${props => css`${float} 3s ease-in-out infinite;`};
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }
`;

const MetricIcon = styled(FontAwesomeIcon)`
  font-size: 1.5em;
  color: #00c3ff;
  
  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

const InfoIcon = styled(FontAwesomeIcon)`
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #00c3ff;
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0 0 5px 0;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PauseButton = styled.button<{ isPaused: boolean }>`
  background: ${props => props.isPaused ? 'rgba(52, 152, 219, 0.3)' : 'rgba(231, 76, 60, 0.3)'};
  color: ${props => props.isPaused ? '#3498db' : '#e74c3c'};
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  
  &:hover {
    background: ${props => props.isPaused ? 'rgba(52, 152, 219, 0.5)' : 'rgba(231, 76, 60, 0.5)'};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff4444;
  animation: ${blink} 1.5s infinite;
`;

const LiveText = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: #ff4444;
  letter-spacing: 1px;
`;

const CardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 992px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const MetricSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
`;

const CurrentValueContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
`;

const CurrentValue = styled.div<{ color: string }>`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${props => props.color};
  text-shadow: 0 0 10px ${props => `${props.color}80`};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const UnitText = styled.span`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 5px;
`;

const TrendIndicator = styled.div<{ trend: 'up' | 'down' | 'stable' }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.trend === 'up' ? '#44ff44' : '#ff4444'};
  margin-left: 10px;
  animation: ${props => css`${float} 2s ease-in-out infinite;`};
`;

const MinMaxContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const MinMaxItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const MinMaxLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const MinMaxValue = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
`;

const ChartSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 768px) {
    height: 120px;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  gap: 2px;
`;

const ChartBar = styled.div<{ color: string }>`
  flex: 1;
  background: linear-gradient(to top, ${props => props.color}, ${props => `${props.color}40`});
  border-radius: 3px 3px 0 0;
  transition: height 0.3s ease;
  min-height: 1px;
  
  &:hover {
    background: ${props => props.color};
    box-shadow: 0 0 10px ${props => props.color};
  }
`;

const TooltipContainer = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 8px 12px;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  min-width: 120px;
  transform: translateX(-50%);
  animation: ${fadeIn} 0.2s ease-out forwards;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgba(0, 0, 0, 0.8);
  }
`;

const TooltipTime = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
  text-align: center;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const TooltipLabel = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
`;

const TooltipValue = styled.span<{ color: string }>`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.color};
`;

export default MetricCard;