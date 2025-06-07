import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faClock, faSun, faLightbulb, faMoon, faChevronDown, faChevronUp, faExchangeAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { useGroups } from '../contexts/GroupsContext';
import { useUserMode } from '../contexts/UserModeContext';

interface GroupControlListProps {
  className?: string;
}

const GroupControlList: React.FC<GroupControlListProps> = ({ className }) => {
  const { 
    groups, 
    toggleGroupExpanded, 
    updateControlMode, 
    activeGroupId, 
    setActiveGroupId,
    showAllControls,
    setShowAllControls,
    getVisibleControls
  } = useGroups();
  const { isOperator } = useUserMode();

  const handleModeChange = (groupId: string, controlId: string, mode: 'off' | 'auto' | 'on') => {
    if (isOperator()) {
      updateControlMode(groupId, controlId, mode);
    }
  };
  
  // Get the controls that should be visible based on current settings
  const visibleControls = getVisibleControls();

  return (
    <Container className={className}>
      <GroupSwitcher>
        <GroupTab 
          key="all"
          active={showAllControls}
          onClick={() => setShowAllControls(true)}
        >
          <FontAwesomeIcon icon={faEye} style={{ marginRight: '6px' }} />
          Show All
          {showAllControls && <ActiveIndicator />}
        </GroupTab>
        {groups.map((group) => (
          <GroupTab 
            key={group.id} 
            active={group.id === activeGroupId && !showAllControls}
            onClick={() => {
              setActiveGroupId(group.id);
              setShowAllControls(false);
            }}
          >
            {group.name}
            {group.id === activeGroupId && !showAllControls && <ActiveIndicator />}
          </GroupTab>
        ))}
      </GroupSwitcher>
      
      {/* Group Summary Section - Shows all groups with just their name and status */}
      <GroupSummarySection>
        {groups.map((group) => (
          <GroupSummaryItem 
            key={group.id}
            active={group.id === activeGroupId && !showAllControls}
            onClick={() => {
              setActiveGroupId(group.id);
              setShowAllControls(false);
            }}
          >
            <GroupName>{group.name}</GroupName>
            <GroupSummaryStatus>
              {group.controls.filter(c => c.isActive).length} of {group.controls.length} active
            </GroupSummaryStatus>
          </GroupSummaryItem>
        ))}
      </GroupSummarySection>
      
      {/* Controls Section - Shows controls based on filter */}
      <ControlsSection>
        <SectionTitle>{showAllControls ? 'All Controls' : groups.find(g => g.id === activeGroupId)?.name + ' Controls'}</SectionTitle>
        
        {visibleControls.length === 0 ? (
          <EmptyState>No controls to display</EmptyState>
        ) : (
          visibleControls.map((control) => {
            // Find which group this control belongs to
            const parentGroup = groups.find(group => 
              group.controls.some(c => c.id === control.id)
            );
            
            if (!parentGroup) return null;
            
            return (
              <ControlItem key={control.id}>
                <ControlHeader>
                  <IconWrapper active={control.isActive || false}>
                    <FontAwesomeIcon icon={control.icon === 'lightbulb' ? faLightbulb : faMoon} />
                  </IconWrapper>
                  <ControlInfo>
                    <ControlTitle>
                      {control.title}
                      <GroupLabel>{parentGroup.name}</GroupLabel>
                    </ControlTitle>
                    <StatusIndicator>
                      <StatusDot active={control.isActive || false} />
                      <StatusText active={control.isActive || false}>
                        {control.isActive ? 'Active' : 'Inactive'}
                      </StatusText>
                    </StatusIndicator>
                  </ControlInfo>
                </ControlHeader>
                
                <ControlButtons>
                  <ModeButton 
                    isActive={control.mode === 'on'}
                    onClick={() => handleModeChange(parentGroup.id, control.id, 'on')}
                    color="#2ecc71"
                    disabled={!isOperator()}
                  >
                    <FontAwesomeIcon icon={faSun} />
                    <span>On</span>
                  </ModeButton>
                  
                  <ModeButton 
                    isActive={control.mode === 'auto'}
                    onClick={() => handleModeChange(parentGroup.id, control.id, 'auto')}
                    color="#3498db"
                    disabled={!isOperator()}
                  >
                    <FontAwesomeIcon icon={faClock} />
                    <span>Auto</span>
                  </ModeButton>
                  
                  <ModeButton 
                    isActive={control.mode === 'off'}
                    onClick={() => handleModeChange(parentGroup.id, control.id, 'off')}
                    color="#e74c3c"
                    disabled={!isOperator()}
                  >
                    <FontAwesomeIcon icon={faPowerOff} />
                    <span>Off</span>
                  </ModeButton>
                </ControlButtons>
              </ControlItem>
            );
          })
        )}
      </ControlsSection>
    </Container>
  );
};

// Update the ExpandIcon styled component to accept isOperator prop
const ExpandIcon = styled.div<{ expanded: boolean; isOperator: boolean }>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  svg {
    color: ${props => props.expanded ? '#3498db' : 'rgba(255, 255, 255, 0.7)'};
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }
  cursor: ${props => props.isOperator ? 'pointer' : 'default'}; // Change cursor based on mode
  opacity: ${props => props.isOperator ? 1 : 0.6}; // Reduce opacity if not operator
  
  &:hover {
    background: ${props => props.isOperator ? (props.expanded ? 'rgba(52, 152, 219, 0.3)' : 'rgba(255, 255, 255, 0.15)') : 'rgba(255, 255, 255, 0.1)'};
    transform: ${props => props.isOperator ? 'scale(1.1)' : 'none'};
  }
`;

// Update the ModeButton styled component to accept disabled prop
const ModeButton = styled.button<{ isActive: boolean; color: string; disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${props => props.isActive ? `rgba(${props.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.3)` : 'rgba(0, 0, 0, 0.3)'};
  color: ${props => props.isActive ? props.color : 'rgba(255, 255, 255, 0.7)'};
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  box-shadow: ${props => props.isActive ? `0 4px 12px ${props.color}22` : 'none'};
  transform: ${props => props.isActive ? 'translateY(-2px)' : 'none'};
  
  &:hover {
    background: ${props => `rgba(${props.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.2)`};
    color: ${props => props.color};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  opacity: ${props => props.disabled ? 0.5 : 1}; // Reduce opacity if disabled
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}; // Change cursor if disabled
  pointer-events: ${props => props.disabled ? 'none' : 'auto'}; // Disable pointer events if disabled
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInAnimation = css`${fadeIn}`;

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GroupSwitcher = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

const GroupTab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? 'rgba(52, 152, 219, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#3498db' : 'rgba(255, 255, 255, 0.8)'};
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? 'rgba(52, 152, 219, 0.4)' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #3498db;
  border-radius: 50%;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GroupContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const GroupName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  color: white;
`;

// ExpandIcon is already defined above

const ControlsContainer = styled.div<{ expanded: boolean }>`
  max-height: ${props => props.expanded ? '1000px' : '0'};
  opacity: ${props => props.expanded ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  padding: ${props => props.expanded ? '12px' : '0 12px'};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 12px;
  animation: ${props => css`${fadeInAnimation} 0.3s ease-out forwards;`};
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const ControlHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const IconWrapper = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.active ? 'rgba(0, 195, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 0 15px rgba(0, 195, 255, 0.5)' : 'none'};
  
  svg {
    font-size: 1.2em;
    color: ${props => props.active ? '#00c3ff' : 'rgba(255, 255, 255, 0.7)'};
    transition: all 0.3s ease;
    animation: ${props => props.active ? css`${glowAnimation} 2s ease-in-out infinite` : 'none'};
  }
`;

const ControlInfo = styled.div`
  flex: 1;
`;

const ControlTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled.div<{ active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ active }) => active ? '#44ff44' : '#ff4444'};
  box-shadow: ${({ active }) => active ? '0 0 8px #44ff44' : '0 0 8px #ff4444'};
  transition: all 0.3s ease;
`;

const StatusText = styled.span<{ active: boolean }>`
  font-size: 0.75em;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  transition: all 0.3s ease;
`;

const ControlButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const GroupSummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const GroupSummaryItem = styled.div<{ active: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: ${props => props.active ? 'rgba(52, 152, 219, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.active ? 'rgba(52, 152, 219, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  
  &:hover {
    background: ${props => props.active ? 'rgba(52, 152, 219, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

const GroupSummaryStatus = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 10px 0;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
`;

const EmptyState = styled.div`
  padding: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  font-size: 0.9rem;
`;

const GroupLabel = styled.span`
  font-size: 0.7rem;
  font-weight: normal;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(52, 152, 219, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
`;

// ModeButton is already defined above with disabled prop

export default GroupControlList;