import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
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
          <MetricIcon>{icon}</MetricIcon>
          <h2>{title}</h2>
        </TitleSection>
        <LiveButton active={isLive} onClick={() => setIsLive(!isLive)}>
          <LiveDot active={isLive} />
          LIVE
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

      <CurrentValue color={color}>
        {data[data.length - 1]?.value.toFixed(1)} {unit}
      </CurrentValue>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  height: 100%;

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
  }

  @media (max-width: 768px) {
    gap: 10px;

    h2 {
      font-size: 1.2em;
    }
  }
`;

const MetricIcon = styled.span`
  font-size: 1.5em;

  @media (max-width: 768px) {
    font-size: 1.3em;
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
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(68, 255, 68, 0.2);
    border-color: #44ff44;
    color: #fff;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.9em;
  }
`;

const LiveDot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#44ff44' : '#ff4444'};
  box-shadow: 0 0 10px ${props => props.active ? '#44ff44' : '#ff4444'};
`;

const ChartWrapper = styled.div`
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 15px 0;
  }

  @media (max-width: 480px) {
    margin: 10px 0;
  }
`;

const TooltipContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: #fff;

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

const CurrentValue = styled.div<{ color: string }>`
  text-align: center;
  font-size: 1.5em;
  font-weight: 600;
  color: ${props => props.color};

  @media (max-width: 768px) {
    font-size: 1.3em;
  }

  @media (max-width: 480px) {
    font-size: 1.2em;
  }
`;

export default WaterMetricCard; 
 