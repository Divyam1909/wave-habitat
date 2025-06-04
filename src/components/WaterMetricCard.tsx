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
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="#fff"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              stroke={color}
              domain={[minDomain, maxDomain]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: color }}
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

const CardContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  height: 100%;
  transition: all 0.3s ease;
  animation: ${float} 8s ease-in-out infinite;
  animation-delay: ${() => Math.random() * 2}s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 15px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
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
  animation: ${pulse} 2s infinite;
  
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
  animation: ${props => props.active ? css`${blink} 2s infinite` : 'none'};
`;

const ChartWrapper = styled.div`
  margin: 20px 0;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px 5px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    margin: 15px 0;
    padding: 8px 3px;
  }

  @media (max-width: 480px) {
    margin: 10px 0;
    padding: 5px 2px;
  }
`;

const TooltipContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  animation: fadeIn 0.2s ease-out forwards;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.9em;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
`;

const CurrentValue = styled.div<{ color: string }>`
  text-align: center;
  font-size: 1.8em;
  font-weight: 700;
  color: ${props => props.color};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.5em;
  }

  @media (max-width: 480px) {
    font-size: 1.3em;
  }
`;

const UnitText = styled.span`
  font-size: 0.6em;
  font-weight: 500;
  opacity: 0.8;
`;

const TrendIndicator = styled.div<{ value: number }>`
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: ${props => props.value > 0 ? '12px solid #44ff44' : props.value < 0 ? '12px solid #ff4444' : '12px solid #aaaaaa'};
  transform: ${props => props.value > 0 ? 'rotate(0deg)' : props.value < 0 ? 'rotate(180deg)' : 'rotate(0deg)'};
  opacity: ${props => props.value === 0 ? '0.5' : '0.8'};
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
`;

export default WaterMetricCard;
 