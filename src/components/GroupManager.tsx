import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEdit, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useGroups } from '../contexts/GroupsContext';
import { useUserMode } from '../contexts/UserModeContext'; // Add this import

const GroupManager: React.FC = () => {
  const { addGroup, groups, deleteGroup, activeGroupId, addControlToGroup } = useGroups();
  const { isOperator } = useUserMode(); // Use the user mode context
  const [newGroupName, setNewGroupName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingControl, setIsAddingControl] = useState(false);
  const [newControlName, setNewControlName] = useState('');
  const [newControlType, setNewControlType] = useState('temperature');
  const handleAddGroup = () => {
    if (newGroupName.trim() !== '') {
      addGroup(newGroupName.trim());
      setNewGroupName('');
      setIsAdding(false);
    }
  };
  
  const toggleAddingState = () => {
    if (isOperator()) { // Only allow toggling if user is an operator
      setIsAdding(!isAdding);
      setNewGroupName('');
    }
  };
  
  const handleAddControl = () => {
    if (newControlName.trim() !== '' && activeGroupId) {
      addControlToGroup(activeGroupId, newControlName.trim(), newControlType);
      setNewControlName('');
      setNewControlType('temperature');
      setIsAddingControl(false);
    }
  };
  
  const toggleAddingControlState = () => {
    if (isOperator()) { // Only allow toggling if user is an operator
      setIsAddingControl(!isAddingControl);
      setNewControlName('');
      setNewControlType('temperature');
    }
  };

  return (
    <Container>
      <Title>Control Groups</Title>
      
      {isAdding ? (
        <AddGroupForm>
          <GroupInput 
            type="text" 
            placeholder="Group name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            autoFocus
          />
          <ButtonGroup>
            <ActionButton onClick={handleAddGroup} color="#2ecc71">
              <FontAwesomeIcon icon={faCheck} />
            </ActionButton>
            <ActionButton onClick={toggleAddingState} color="#e74c3c">
              <FontAwesomeIcon icon={faTimes} />
            </ActionButton>
          </ButtonGroup>
        </AddGroupForm>
      ) : (
        <AddButton onClick={toggleAddingState} disabled={!isOperator()}> {/* Disable button if not operator */}
          <FontAwesomeIcon icon={faPlus} />
          <span>Add Group</span>
        </AddButton>
      )}
      
      {groups.length > 0 && (
        <GroupList>
          {groups.map(group => (
            <GroupItem key={group.id} active={group.id === activeGroupId}>
              <GroupItemName>{group.name}</GroupItemName>
              {isOperator() && (
                <DeleteButton onClick={() => deleteGroup(group.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </DeleteButton>
              )}
            </GroupItem>
          ))}
        </GroupList>
      )}
      
      {activeGroupId && isOperator() && (
        <Section>
          <SectionTitle>Add Controls</SectionTitle>
          {isAddingControl ? (
            <AddControlForm>
              <GroupInput 
                type="text" 
                placeholder="Control name..."
                value={newControlName}
                onChange={(e) => setNewControlName(e.target.value)}
                autoFocus
              />
              <SelectWrapper>
                <ControlTypeSelect
                  value={newControlType}
                  onChange={(e) => setNewControlType(e.target.value)}
                >
                  <option value="temperature">Temperature</option>
                  <option value="light">Light</option>
                  <option value="ph">pH</option>
                  <option value="oxygen">Oxygen</option>
                </ControlTypeSelect>
              </SelectWrapper>
              <ButtonGroup>
                <ActionButton onClick={handleAddControl} color="#2ecc71">
                  <FontAwesomeIcon icon={faCheck} />
                </ActionButton>
                <ActionButton onClick={toggleAddingControlState} color="#e74c3c">
                  <FontAwesomeIcon icon={faTimes} />
                </ActionButton>
              </ButtonGroup>
            </AddControlForm>
          ) : (
            <AddButton onClick={toggleAddingControlState} disabled={!isOperator() || !activeGroupId}>
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Control</span>
            </AddButton>
          )}
        </Section>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #fff;
`;

const AddGroupForm = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const GroupInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: rgba(46, 204, 113, 0.5);
    box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.color}33;
  color: ${props => props.color};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.color}66;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AddButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background: rgba(46, 204, 113, 0.3);
  }
  
  &:active {
    transform: translateY(2px);
  }
  
  /* Add styles for disabled state */
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

const GroupList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GroupItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.active ? 'rgba(52, 152, 219, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 10px 12px;
  transition: all 0.2s ease;
  border-left: ${props => props.active ? '4px solid #3498db' : 'none'};
  
  &:hover {
    background: ${props => props.active ? 'rgba(52, 152, 219, 0.3)' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const GroupItemName = styled.span`
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(231, 76, 60, 0.3);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Section = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12px;
  font-weight: 500;
`;

const AddControlForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  
  &::after {
    content: '▼';
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

const ControlTypeSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: rgba(52, 152, 219, 0.5);
  }
  
  option {
    background: #1a1a1a;
  }
`;

export default GroupManager;