import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface WaterMetricCardProps {
  title: string;
  unit: string;
  baseValue: number;
  variance: number;
  color: string;
  icon: string;
  minDomain: number;
  maxDomain: number;
}

const WaterMetricCard: React.FC<WaterMetricCardProps> = ({
  title,
  unit,
  baseValue,
  variance,
  color,
  icon,
  minDomain,
  maxDomain,
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLive, setIsLive] = useState(true);

  const generateDataPoint = useCallback((timestamp: number) => {
    const hour = new Date(timestamp).getHours();
    const dayProgress = hour / 24;
    const base = baseValue + Math.sin(dayProgress * Math.PI * 2) * (variance * 0.5);
    const value = base + (Math.random() - 0.5) * variance;

    return {
      timestamp,
      value: Number(value.toFixed(1)),
    };
  }, [baseValue, variance]);

  useEffect(() => {
    const now = Date.now();
    const points = 30;
    const interval = 60 * 1000; // 1 minute intervals
    
    const initialData = Array.from({ length: points }, (_, i) => {
      const timestamp = now - (points - i) * interval;
      return generateDataPoint(timestamp);
    });
    
    setData(initialData);

    if (isLive) {
      const timer = setInterval(() => {
        setData(prevData => {
          const newTimestamp = Date.now();
          const newPoint = generateDataPoint(newTimestamp);
          return [...prevData.slice(1), newPoint];
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLive, generateDataPoint]);

  const formatXAxis = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <TooltipContainer>
          <TooltipTime>{new Date(label).toLocaleString()}</TooltipTime>
          <TooltipRow>
            <TooltipLabel color={color}>
              {icon} {title}:
            </TooltipLabel>
            <TooltipValue>
              {payload[0].value} {unit}
            </TooltipValue>
          </TooltipRow>
        </TooltipContainer>
      );
    }
    return null;
  };

  return (
    <CardContainer>
      <CardHeader>
        <TitleSection>
          <IconContainer>
            <MetricIcon>{icon}</MetricIcon>
          </IconContainer>
          <h2>{title}</h2>
        </TitleSection>
        <LiveButton active={isLive} onClick={() => setIsLive(!isLive)}>
          <LiveDot active={isLive} />
          <LiveText>LIVE</LiveText>
        </LiveButton>
      </CardHeader>

      <ChartWrapper>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 25, bottom: 20 }}
          >
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="#fff"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: '#fff', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            />
            <YAxis
              stroke={color}
              domain={[minDomain, maxDomain]}
              tick={{ fill: '#fff', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              tickCount={5}
            >
              <Label 
                value={unit}
                position="insideLeft"
                angle={-90}
                style={{ textAnchor: 'middle', fill: '#fff', fontSize: 12 }}
                offset={-15}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: '#fff' }}
              fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <CurrentValueContainer>
        <CurrentValue color={color}>
          {data[data.length - 1]?.value.toFixed(1)}
          <UnitText>{unit}</UnitText>
        </CurrentValue>
        <TrendIndicator value={data.length > 1 ? data[data.length - 1].value - data[data.length - 2].value : 0} />
      </CurrentValueContainer>
    </CardContainer>
  );
};

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
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

const floatAnimation = css`${float}`;
const pulseAnimation = css`${pulse}`;

const CardContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  height: 100%;
  transition: all 0.3s ease;
  animation: ${props => css`${floatAnimation} 8s ease-in-out infinite;`};
  animation-delay: ${() => Math.random() * 2}s;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 15px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 20px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 15px;
    gap: 10px;
  }
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 15px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    justify-items: center;
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

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: ${props => css`${pulse} 2s infinite;`};
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }
`;

const MetricIcon = styled.span`
  font-size: 1.5em;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));

  @media (max-width: 768px) {
    font-size: 1.3em;
  }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const LiveButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.active ? 'rgba(68, 255, 68, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  border: 1px solid ${props => props.active ? '#44ff44' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 0 15px rgba(68, 255, 68, 0.3)' : 'none'};

  &:hover {
    background: rgba(68, 255, 68, 0.2);
    border-color: #44ff44;
    color: #fff;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.9em;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const LiveText = styled.span`
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 0.85em;
`;

const LiveDot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#44ff44' : '#ff4444'};
  box-shadow: 0 0 10px ${props => props.active ? '#44ff44' : '#ff4444'};
  animation: ${props => props.active ? css`${blink} 2s infinite;` : 'none'};
`;

const ChartWrapper = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  padding: 15px 10px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  min-height: 220px;
  
  &:hover {
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    min-height: 200px;
  }

  @media (max-width: 480px) {
    padding: 10px 5px;
    min-height: 180px;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TooltipContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  animation: ${props => css`${fadeIn} 0.2s ease-out forwards;`};
  z-index: 10;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.9em;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    font-size: 0.85em;
    max-width: 200px;
  }
`;

const TooltipTime = styled.div`
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 4px;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
`;

const TooltipLabel = styled.span<{ color: string }>`
  color: ${props => props.color};
`;

const TooltipValue = styled.span`
  font-weight: bold;
`;

const CurrentValueContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: ${props => css`${fadeIn} 0.3s ease-out forwards;`};
  
  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 8px;
    padding: 10px;
  }
`;

const CurrentValue = styled.div<{ color: string }>`
  font-size: 2em;
  font-weight: 600;
  color: ${props => props.color};
  display: flex;
  align-items: baseline;
  gap: 5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: ${props => `linear-gradient(90deg, ${props.color}, #ffffff, ${props.color})`};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${props => css`${shimmer} 3s linear infinite;`};
  
  @media (max-width: 768px) {
    font-size: 1.8em;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6em;
    justify-content: center;
  }
`;

const UnitText = styled.span`
  font-size: 0.5em;
  font-weight: 400;
  opacity: 0.8;
  margin-left: 5px;
`;

const TrendIndicator = styled.div<{ value: number }>`
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: ${props => props.value >= 0 ? '12px solid #44ff44' : '0'};
  border-top: ${props => props.value < 0 ? '12px solid #ff4444' : '0'};
  margin-left: 10px;
  opacity: ${props => Math.abs(props.value) > 0.1 ? '1' : '0.3'};
  transition: all 0.3s ease;
  animation: ${props => css`${float} 2s ease-in-out infinite;`};
  
  @media (max-width: 480px) {
    margin: 0 auto;
  }
`;

export default WaterMetricCard;
 