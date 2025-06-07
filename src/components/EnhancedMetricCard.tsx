import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faWater, faTemperatureHalf, faLeaf, faLightbulb, faInfoCircle, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import ReactSpeedometer from 'react-d3-speedometer';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface ChartData {
  time: string;
  value: number;
}

interface EnhancedMetricCardProps {
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

const EnhancedMetricCard: React.FC<EnhancedMetricCardProps> = ({
  title,
  icon,
  currentValue: initialValue,
  unit,
  minValue,
  maxValue,
  chartData: initialChartData,
  isLive = true,
  trend = 'stable',
  color = '#00c3ff',
  className,
  updateInterval = 3000, // Default update every 3 seconds
  varianceRange = 5 // Default variance range of ±5%
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState<{ time: string; value: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // State for live data
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [chartData, setChartData] = useState(initialChartData);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  
  // Toggle pause state
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Effect for live data updates
  useEffect(() => {
    if (!isLive || isPaused) return;
    
    // Function to generate a new value with random variance
    const generateNewValue = () => {
      // Calculate a random variance within the specified range
      const variance = (Math.random() * 2 - 1) * varianceRange / 100;
      // Apply the variance to the current value
      let newValue = currentValue * (1 + variance);
      // Ensure the new value stays within min and max bounds
      newValue = Math.max(minValue, Math.min(maxValue, newValue));
      return parseFloat(newValue.toFixed(2));
    };
    
    // Function to update the chart data
    const updateData = () => {
      const newValue = generateNewValue();
      setCurrentValue(newValue);
      
      // Create a new timestamp for the data point
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      // Add the new data point to the chart data
      const newDataPoint = { time: timeString, value: newValue };
      setChartData(prevChartData => [...prevChartData.slice(1), newDataPoint]);
    };
    
    // Set up the interval for updates
    intervalRef.current = setInterval(updateData, updateInterval);
    
    // Clean up the interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLive, isPaused, minValue, maxValue, updateInterval, varianceRange, currentValue]);

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

  // Custom tooltip for the recharts component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <TooltipContainer>
          <TooltipTime>{label}</TooltipTime>
          <TooltipRow>
            <TooltipLabel>{title}:</TooltipLabel>
            <TooltipValue color={color}>
              {payload[0].value.toFixed(1)} {unit}
            </TooltipValue>
          </TooltipRow>
        </TooltipContainer>
      );
    }
    return null;
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
                <LiveDot isPaused={isPaused} />
                <LiveText isPaused={isPaused}>{isPaused ? 'PAUSED' : 'LIVE'}</LiveText>
              </LiveIndicator>
            )}
          </div>
        </TitleSection>
        <HeaderControls>
          {isLive && (
            <PauseButton onClick={togglePause}>
              <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
            </PauseButton>
          )}
          <InfoIcon>
            <FontAwesomeIcon icon={faInfoCircle} />
          </InfoIcon>
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
        
        <ChartsSection>
          <RadialChartContainer>
            <ReactSpeedometer
              value={currentValue}
              minValue={minValue}
              maxValue={maxValue}
              segments={5}
              needleColor="steelblue"
              startColor="#44ff44"
              endColor="#ff4444"
              textColor="#666"
              currentValueText={`${currentValue.toFixed(1)} ${unit}`}
              customSegmentStops={[minValue, minValue + (maxValue - minValue) * 0.25, minValue + (maxValue - minValue) * 0.75, maxValue]}
              segmentColors={['#44ff44', '#ffaa00', '#ff4444']}
            />
          </RadialChartContainer>
          
          <LinearChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }} /* Adjusted margins for better fit */
              >
                <defs>
                  <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: '#fff', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                />
                <YAxis 
                  domain={[minValue, maxValue]}
                  tick={{ fill: '#fff', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2}
                  fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
                  activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </LinearChartContainer>
        </ChartsSection>
      </CardContent>
    </CardContainer>
  );
};

// Add new styled components for the charts layout
const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 15px; /* Adjusted gap for better alignment */
  height: 300px;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    height: auto;
  }
`;

const RadialChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    min-height: 200px;
  }
`;

const LinearChartContainer = styled.div`
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    min-height: 200px;
  }
`;


export default EnhancedMetricCard;

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
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const CardContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  height: 100%;
  min-height: 600px;
  transition: all 0.3s ease;
  animation: ${props => css`${floatAnimation} 8s ease-in-out infinite;`};
  animation-delay: ${() => Math.random() * 2}s;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 20px;
    gap: 12px;
    min-height: 400px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 15px;
    gap: 10px;
    min-height: 350px;
  }
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    justify-items: center;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
`;

const MetricSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

const CurrentValueContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
  justify-content: center;
  padding: 5px 0;
`;

const CurrentValue = styled.span<{ color?: string }>`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${props => props.color || 'white'};
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const UnitText = styled.span`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
`;

const TrendIndicator = styled.span<{ trend: 'up' | 'down' | 'stable' }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.trend === 'up' ? '#4caf50' : props.trend === 'down' ? '#f44336' : '#ffffff'};
  margin-left: 5px;
`;

const MinMaxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 5px;
`;

const MinMaxItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 15px;
  border-radius: 10px;
  flex: 1;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;


const MinMaxLabel = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2px;
`;

const MinMaxValue = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const TooltipContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 200px;
  animation: ${fadeIn} 0.2s ease-out;
`;


const TooltipTime = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 5px;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;

const TooltipLabel = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 10px;
`;

const TooltipValue = styled.span<{ color?: string }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.color || 'white'};
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
`;

const LiveDot = styled.div<{ isPaused?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.isPaused ? '#e74c3c' : '#ff3e3e'};
  animation: ${props => props.isPaused ? 'none' : css`${pulseAnimation} 1.5s infinite`};
`;

const LiveText = styled.span<{ isPaused?: boolean }>`
  font-size: 0.7rem;
  color: ${props => props.isPaused ? 'rgba(255, 76, 76, 0.8)' : 'rgba(255, 255, 255, 0.7)'};
  letter-spacing: 0.5px;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PauseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  
  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;


const InfoIcon = styled.div`
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  h2 {
    font-size: 1.3em;
    font-weight: 500;
    color: white;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    gap: 10px;

    h2 {
      font-size: 1.2em;
    }
  }
  
  @media (max-width: 480px) {
    justify-content: center;
    
    h2 {
      font-size: 1.1em;
    }
  }
`;

const IconContainer = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color ? `${props.color}33` : 'rgba(255, 255, 255, 0.1)'}; /* 20% opacity */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: ${pulse} 2s infinite;
  
  svg {
    color: ${props => props.color || 'white'};
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }
`;

const MetricIcon = styled(FontAwesomeIcon)`
  font-size: 1.5em;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));

  @media (max-width: 768px) {
    font-size: 1.3em;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.3em;
  font-weight: 500;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;