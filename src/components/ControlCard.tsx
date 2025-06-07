import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPowerOff, faClock, faSun, faLightbulb, faMoon, faSliders } from '@fortawesome/free-solid-svg-icons';
import { useUserMode } from '../contexts/UserModeContext';
import { useGroups } from '../contexts/GroupsContext';

interface ControlCardProps {
  title: string;
  icon: 'lightbulb' | 'moon';
  controlId: string;
  groupId: string;
  groupName: string;
}

type Mode = 'off' | 'auto' | 'on';

interface ButtonProps {
  isActive?: boolean;
  variant?: 'on' | 'auto' | 'off';
  color?: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const float = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  }
  50% {
    transform: translateY(-5px) rotate(0.5deg);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.3);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  }
`;

const floatAnimation = css`${float}`;

const animate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const animateRotation = css`${animate}`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(0, 195, 255, 0.5);
    text-shadow: 0 0 5px rgba(0, 195, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 195, 255, 0.8);
    text-shadow: 0 0 10px rgba(0, 195, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(0, 195, 255, 0.5);
    text-shadow: 0 0 5px rgba(0, 195, 255, 0.5);
  }
`;

const glowAnimation = css`${glow}`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const shimmerAnimation = css`${shimmer}`;

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

const rippleAnimation = css`${ripple}`;

const ControlCard: React.FC<ControlCardProps> = ({ title, icon, controlId, groupId, groupName }) => {
  const [showSettings, setShowSettings] = useState(false);
  const { isOperator, isProgrammer } = useUserMode();
  const { groups, updateControlMode, updateAutoSettings } = useGroups();
  
  // State for auto settings form
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState(0);
  const [interval, setInterval] = useState(0);
  
  // Find the control in the groups
  const group = groups.find(g => g.id === groupId);
  const control = group?.controls.find(c => c.id === controlId);
  
  // Get mode and active status from the control
  const mode = control?.mode || 'off';
  const isActive = control?.isActive || false;

  const toggleSettings = () => {
    if (isOperator() || isProgrammer()) {
      // If opening settings panel, initialize form values from existing settings
      if (!showSettings) {
        const control = group?.controls.find(c => c.id === controlId);
        if (control?.autoSettings) {
          setStartTime(control.autoSettings.startTime || '');
          setEndTime(control.autoSettings.endTime || '');
          setDuration(control.autoSettings.duration || 0);
          setInterval(control.autoSettings.interval || 0);
        }
      }
      setShowSettings(prev => !prev);
    }
  };

  const handleModeChange = (newMode: Mode) => {
    if (isOperator() || isProgrammer()) {
      updateControlMode(groupId, controlId, newMode);
    }
  };
  
  const handleSaveAutoSettings = () => {
    if (isProgrammer()) {
      updateAutoSettings(groupId, controlId, {
        startTime,
        endTime,
        duration,
        interval,
        enabled: true
      });
    }
  };

  // Extract autoSettings outside of useEffect to avoid unnecessary dependency on the entire group object
  const autoSettings = control?.autoSettings;
  
  useEffect(() => {
    let intervalId: number | undefined;
    if (mode === 'auto') {
      // Use configured interval if available, otherwise default to 2000ms
      const autoInterval = autoSettings?.interval ? autoSettings.interval * 1000 : 2000;
      
      // In browser environment, setInterval returns a number
      intervalId = window.setInterval(() => {
        // Determine 'on' or 'off' based on autoSettings startTime and endTime
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [startHour, startMinute] = (autoSettings?.startTime || '00:00').split(':').map(Number);
        const [endHour, endMinute] = (autoSettings?.endTime || '00:00').split(':').map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        let newMode: Mode = 'off';
        if (startTotalMinutes < endTotalMinutes) {
          if (currentMinutes >= startTotalMinutes && currentMinutes < endTotalMinutes) {
            newMode = 'on';
          }
        } else { // Overnight case
          if (currentMinutes >= startTotalMinutes || currentMinutes < endTotalMinutes) {
            newMode = 'on';
          }
        }
        updateControlMode(groupId, controlId, newMode);
      }, autoInterval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mode, isActive, groupId, controlId, updateControlMode, autoSettings]);

  return (
    <CardContainer active={isActive}>
      <CardHeader>
        <TitleSection>
          <IconWrapper active={isActive}>
            <FontAwesomeIcon icon={icon === 'lightbulb' ? faLightbulb : faMoon} />
          </IconWrapper>
          <div>
            <h2>{title}</h2>
            <GroupLabel>{groupName}</GroupLabel>
          </div>
        </TitleSection>
        <StatusIndicator>
          <StatusDot active={isActive} />
          <StatusText active={isActive}>{isActive ? 'Active' : 'Inactive'}</StatusText>
        </StatusIndicator>
        {isProgrammer() && (
          <SettingsButton onClick={toggleSettings} active={showSettings}>
            <FontAwesomeIcon icon={showSettings ? faSliders : faCog} />
          </SettingsButton>
        )}
      </CardHeader>
      
      {showSettings && (
        <SettingsPanel>
          {/* Auto Settings Configuration */}
          <SettingHeader>Auto Mode Configuration</SettingHeader>
          
          <SettingRow>
            <SettingLabel>
              <FontAwesomeIcon icon={faClock} />
              Start Time
            </SettingLabel>
            <TimeInput 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
            />
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>
              <FontAwesomeIcon icon={faClock} />
              End Time
            </SettingLabel>
            <TimeInput 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
            />
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>
              <FontAwesomeIcon icon={faClock} />
              Duration (seconds)
            </SettingLabel>
            <NumberInput 
              type="number" 
              min="0" 
              value={duration} 
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)} 
            />
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>
              <FontAwesomeIcon icon={faClock} />
              Interval (seconds)
            </SettingLabel>
            <NumberInput 
              type="number" 
              min="0" 
              value={interval} 
              onChange={(e) => setInterval(parseInt(e.target.value) || 0)} 
            />
          </SettingRow>
          
          <SaveButton onClick={handleSaveAutoSettings}>
            Save Auto Settings
          </SaveButton>
        </SettingsPanel>
      )}

      <ControlButtonsGrid>
        <Button
          isActive={mode === 'on'}
          onClick={() => handleModeChange('on')}
          variant="on"
          color="#2ecc71"
        >
          <WaterEffect isActive={mode === 'on'} variant="on" color="#2ecc71" />
          <ButtonContent>
            <FontAwesomeIcon icon={faSun} />
            <ButtonText>On</ButtonText>
          </ButtonContent>
        </Button>

        <Button
          isActive={mode === 'auto'}
          onClick={() => handleModeChange('auto')}
          variant="auto"
          active={mode === 'auto' && isActive}
          color="#3498db"
        >
          <WaterEffect isActive={mode === 'auto'} variant="auto" active={isActive} color="#3498db" />
          <ButtonContent>
            <FontAwesomeIcon icon={faClock} />
            <ButtonText>
              {mode === 'auto' && control?.autoSettings?.enabled ? (
                <>
                  Auto
                  {control.autoSettings.startTime && control.autoSettings.endTime && (
                    <AutoTimeRange>
                      {control.autoSettings.startTime} - {control.autoSettings.endTime}
                    </AutoTimeRange>
                  )}
                </>
              ) : (
                'Auto'
              )}
            </ButtonText>
          </ButtonContent>
        </Button>

        <Button
          isActive={mode === 'off'}
          onClick={() => handleModeChange('off')}
          variant="off"
          color="#e74c3c"
        >
          <WaterEffect isActive={mode === 'off'} variant="off" color="#e74c3c" />
          <ButtonContent>
            <FontAwesomeIcon icon={faPowerOff} />
            <ButtonText>Off</ButtonText>
          </ButtonContent>
        </Button>
      </ControlButtonsGrid>
    </CardContainer>
  );
};

const CardContainer = styled.div<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: ${props => props.active ? 
    '0 8px 32px 0 rgba(31, 38, 135, 0.3), 0 0 15px rgba(0, 195, 255, 0.3)' : 
    '0 8px 32px 0 rgba(31, 38, 135, 0.2)'};
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  animation: ${props => css`${float} 6s ease-in-out infinite;`};
  width: 100%;
  max-width: 100%;
  margin: 0;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  perspective: 1000px;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 15px;
  min-height: 350px;
  position: relative; /* ADDED: Ensure absolutely positioned children are relative to this container */
  overflow: visible;  /* Ensure dropdown isn't clipped */

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 15px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2; /* Ensure header is above other card content but below settings panel */

  @media (max-width: 768px) {
    padding: 0 5px 12px 5px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding-bottom: 15px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 5px;

  h2 {
    font-size: 1.3em;
    font-weight: 500;
    color: white;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  div {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    gap: 10px;

    h2 {
      font-size: 1.2em;
    }
  }
`;

const IconWrapper = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? 'rgba(0, 195, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 0 15px rgba(0, 195, 255, 0.5)' : 'none'};
  
  svg {
    font-size: 1.5em;
    color: ${props => props.active ? '#00c3ff' : 'rgba(255, 255, 255, 0.7)'};
    transition: all 0.3s ease;
    animation: ${props => props.active ? css`${glow} 2s ease-in-out infinite` : 'none'};
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    
    svg {
      font-size: 1.3em;
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

const StatusText = styled.span<{ active: boolean }>`
  font-size: 0.9em;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  transition: all 0.3s ease;
  background: ${props => props.active ? 'linear-gradient(90deg, #00c3ff, #44ff44, #00c3ff)' : 'none'};
  background-size: ${props => props.active ? '200% auto' : 'auto'};
  -webkit-background-clip: ${props => props.active ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.active ? 'transparent' : 'inherit'};
  animation: ${props => props.active ? css`${shimmer} 3s linear infinite` : 'none'};
`;

const SettingsButton = styled.button<{ active: boolean }>`
  position: absolute;
  top: 0px; /* Adjusted to be within the header */
  right: 0px; /* Adjusted to be within the header */
  background: ${props => props.active ? 'rgba(0, 195, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)'};
  border: 2px solid ${props => props.active ? 'rgba(0, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#ffffff' : '#ffffff80'};
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  transform: ${props => props.active ? 'rotate(180deg)' : 'rotate(0deg)'};

  &:hover {
    color: #fff;
    background: ${props => props.active ? 'rgba(0, 195, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 195, 255, 0.3);
    transform: ${props => props.active ? 'rotate(180deg) scale(1.05)' : 'rotate(0deg) scale(1.05)'};
  }
  
  &:active {
    transform: ${props => props.active ? 'rotate(180deg) scale(0.95)' : 'rotate(0deg) scale(0.95)'};
  }
`;

const SettingsPanel = styled.div`
  background: rgba(0, 10, 20, 0.95);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: fadeIn 0.4s cubic-bezier(0.26, 0.53, 0.74, 1.48) forwards;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 195, 255, 0.3);
  border: 1px solid rgba(0, 195, 255, 0.3);
  width: calc(100% - 20px); /* Adjusted to fit within the card with padding */
  max-height: 300px; /* Set a max height to enable scrolling */
  overflow-y: auto; /* Enable vertical scrolling */
  position: absolute;
  top: 60px; /* Adjusted to drop down from the button */
  right: 10px; /* Adjusted for better positioning */
  z-index: 100;
  backdrop-filter: blur(15px);
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -8px;
    right: 20px;
    width: 16px;
    height: 16px;
    background: rgba(0, 10, 20, 0.95);
    transform: rotate(45deg);
    border-top: 1px solid rgba(0, 195, 255, 0.3);
    border-left: 1px solid rgba(0, 195, 255, 0.3);
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    gap: 12px;
    width: 95%;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 10px;
    width: 100%;
    right: 0;
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 15px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 195, 255, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    gap: 12px;
    padding: 4px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 3px;
  }
`;

const SettingLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;
  letter-spacing: 0.5px;
  
  svg {
    color: rgba(0, 195, 255, 0.8);
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 3px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 2px;
  }
`;

const RangeSlider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 150px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  outline: none;
  margin: 0 10px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #00C3FF;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
    transition: all 0.2s ease;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #00C3FF;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
    transition: all 0.2s ease;
  }
  
  &:hover::-webkit-slider-thumb {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(0, 195, 255, 0.7);
  }
  
  &:hover::-moz-range-thumb {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(0, 195, 255, 0.7);
  }
  
  @media (max-width: 768px) {
    width: 120px;
    height: 6px;
    margin: 0 8px;
    
    &::-webkit-slider-thumb {
      width: 18px;
      height: 18px;
    }
    
    &::-moz-range-thumb {
      width: 18px;
      height: 18px;
    }
  }
  
  @media (max-width: 480px) {
    width: 100%;
    margin: 5px 0;
    
    &::-webkit-slider-thumb {
      width: 16px;
      height: 16px;
    }
    
    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
    }
  }
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 12px;
  padding: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    gap: 10px;
    padding: 3px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
    padding: 2px;
  }
`;

const ColorOption = styled.button<{ color: string; selected?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 2px solid ${props => props.selected ? '#fff' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.selected ? `0 0 10px ${props.color}` : '0 2px 5px rgba(0, 0, 0, 0.2)'};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px ${props => props.color};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.2s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 480px) {
    width: 22px;
    height: 22px;
  }
`;

const SettingDivider = styled.div`
  height: 1px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  margin: 15px 0;
`;

const SettingHeader = styled.h3`
  font-size: 16px;
  margin: 0 0 15px 0;
  color: #00c3ff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 195, 255, 0.3);
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
  
  @media (max-width: 768px) {
    font-size: 15px;
    margin: 0 0 12px 0;
    padding-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin: 0 0 10px 0;
    padding-bottom: 5px;
  }
`;

const TimeInput = styled.input`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 195, 255, 0.3);
  border-radius: 8px;
  color: white;
  padding: 10px 15px;
  font-size: 14px;
  width: 130px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    border-color: rgba(0, 195, 255, 0.5);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 5px rgba(0, 195, 255, 0.2);
  }
  
  &:focus {
    outline: none;
    border-color: #00c3ff;
    box-shadow: 0 0 0 2px rgba(0, 195, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.3);
    background: rgba(0, 20, 40, 0.5);
  }
  
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.7;
    cursor: pointer;
  }
  
  &::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 13px;
    width: 120px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 12px;
    width: 100%;
  }
`;

const NumberInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  font-size: 0.9rem;
  width: 80px;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 10px rgba(0, 195, 255, 0.3);
  }
  
  &::-webkit-inner-spin-button, 
  &::-webkit-outer-spin-button { 
    opacity: 1;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #3498db, #2980b9);
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  color: white;
  font-weight: 500;
  margin-top: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #2980b9, #3498db);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
`;

const ControlButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  
  @media (max-width: 768px) {
    gap: 12px;
    padding: 8px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 5px;
  }
`;

// ButtonProps interface is already defined at the top of the file

interface WaterEffectProps {
  isActive: boolean;
  variant?: 'off' | 'auto' | 'on';
  active?: boolean;
  color: string;
}

const WaterEffect = styled.div<WaterEffectProps>`
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
    if (props.variant === 'off') return '#e74c3c';
    if (props.variant === 'on') return '#2ecc71';
    return '#2893eb';
  }};
  
  box-shadow: ${props => {
    let color = '#104e81';
    if (props.variant === 'auto') {
      color = props.active ? '#27ae60' : '#c0392b';
    } else if (props.variant === 'off') {
      color = '#c0392b';
    } else if (props.variant === 'on') {
      color = '#27ae60';
    }
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
      if (props.variant === 'off') return 'rgba(231, 76, 60, 0.8)';
      if (props.variant === 'on') return 'rgba(46, 204, 113, 0.8)';
      return 'rgba(68, 160, 235, 0.8)';
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
  background: ${props => props.isActive ? 
    props.variant === 'on' ? 'linear-gradient(135deg, #00C3FF, #0077FF)' :
    props.variant === 'auto' ? 'linear-gradient(135deg, #FF9D00, #FF6B00)' :
    'linear-gradient(135deg, #FF0099, #FF005C)' :
    'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'};
  border: none;
  border-radius: 12px;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: ${props => props.isActive ? 
    '0 8px 16px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 195, 255, 0.3)' : 
    '0 4px 12px rgba(0, 0, 0, 0.1)'};
  text-shadow: ${props => props.isActive ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'};
  height: 100%;
  min-height: 120px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.isActive ? 
      '0 12px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 195, 255, 0.4)' : 
      '0 8px 20px rgba(0, 0, 0, 0.2)'};
    background: ${props => props.isActive ? 
      props.variant === 'on' ? 'linear-gradient(135deg, #00D4FF, #0088FF)' :
      props.variant === 'auto' ? 'linear-gradient(135deg, #FFAE00, #FF7C00)' :
      'linear-gradient(135deg, #FF00AA, #FF006D)' :
      'rgba(255, 255, 255, 0.1)'};
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: ${props => props.isActive ? 
      '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 195, 255, 0.2)' : 
      '0 2px 8px rgba(0, 0, 0, 0.1)'};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.8);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  &:focus:not(:active)::after {
    animation: ${ripple} 1s ease-out;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 15px;
    gap: 8px;
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
    gap: 6px;
    min-height: 80px;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 5px;
  
  @media (max-width: 768px) {
    gap: 8px;
    padding: 3px;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
    padding: 2px;
  }
`;

const ButtonText = styled.span`
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-top: 3px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 2px;
  }
`;

const AutoTimeRange = styled.small`
  font-size: 0.7rem;
  opacity: 0.8;
  margin-top: 2px;
  white-space: nowrap;
`;

const GroupLabel = styled.span`
  font-size: 0.7rem;
  font-weight: normal;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(52, 152, 219, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
  display: inline-block;
`;

// Update the ControlButton styled component
const ControlButton = styled.button<{ active: boolean; disabled: boolean }>`
  background: ${props => props.active ? 'rgba(0, 195, 255, 0.2)' : 'none'};
  border: none;
  color: ${props => props.active ? '#00c3ff' : '#ffffff80'};
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    animation: ${glow} 2s ease-in-out infinite;
  }
  
  &:active {
    transform: scale(0.95);
  }
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

export default ControlCard;