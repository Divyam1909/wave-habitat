import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface ControlGroup {
  id: string;
  name: string;
  controls: ControlItem[];
  expanded?: boolean;
}

export interface AutoSettings {
  startTime?: string; // Format: 'HH:MM'
  endTime?: string; // Format: 'HH:MM'
  duration?: number; // Duration in seconds
  interval?: number; // Interval in seconds
  enabled?: boolean;
}

export interface ControlItem {
  id: string;
  title: string;
  icon: 'lightbulb' | 'moon';
  mode?: 'off' | 'auto' | 'on';
  isActive?: boolean;
  name?: string;
  type?: string;
  autoSettings?: AutoSettings;
}

interface GroupsContextType {
  groups: ControlGroup[];
  activeGroupId: string | null;
  setActiveGroupId: (id: string) => void;
  showAllControls: boolean;
  setShowAllControls: (show: boolean) => void;
  addGroup: (name: string) => void;
  editGroup: (id: string, name: string) => void;
  deleteGroup: (id: string) => void;
  toggleGroupExpanded: (id: string) => void;
  addControlToGroup: (groupId: string, controlName: string, controlType: string) => void;
  deleteControlFromGroup: (groupId: string, controlId: string) => void;
  updateControlMode: (groupId: string, controlId: string, mode: 'off' | 'auto' | 'on') => void;
  updateAutoSettings: (groupId: string, controlId: string, settings: AutoSettings) => void;
  getVisibleControls: () => ControlItem[];
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};

interface GroupsProviderProps {
  children: ReactNode;
}

export const GroupsProvider: React.FC<GroupsProviderProps> = ({ children }) => {
  const [groups, setGroups] = useState<ControlGroup[]>([
    {
      id: '1',
      name: 'Lighting',
      expanded: true,
      controls: [
        { id: '1', title: 'Wave Generator', icon: 'lightbulb', mode: 'off', isActive: false },
        { id: '2', title: 'Lighting', icon: 'lightbulb', mode: 'off', isActive: false },
      ]
    },
    {
      id: '2',
      name: 'Water Systems',
      expanded: false,
      controls: [
        { id: '3', title: 'Oxygen Pump', icon: 'lightbulb', mode: 'off', isActive: false },
        { id: '4', title: 'Water Filter', icon: 'moon', mode: 'off', isActive: false },
      ]
    },
    {
      id: '3',
      name: 'Environment',
      expanded: false,
      controls: [
        { id: '5', title: 'Temperature', icon: 'lightbulb', mode: 'off', isActive: false },
        { id: '6', title: 'Feeding System', icon: 'moon', mode: 'off', isActive: false },
      ]
    }
  ]);
  
  // Track the active group
  const [activeGroupId, setActiveGroupId] = useState<string | null>('1');
  
  // Track whether to show all controls or just the active group's controls
  const [showAllControls, setShowAllControls] = useState<boolean>(true);

  const addGroup = (name: string) => {
    const newGroup: ControlGroup = {
      id: Date.now().toString(),
      name,
      controls: [],
      expanded: true
    };
    setGroups([...groups, newGroup]);
  };

  const editGroup = (id: string, name: string) => {
    setGroups(groups.map(group => 
      group.id === id ? { ...group, name } : group
    ));
  };

  const deleteGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
  };

  const toggleGroupExpanded = (id: string) => {
    setGroups(groups.map(group => 
      group.id === id ? { ...group, expanded: !group.expanded } : group
    ));
  };

  const addControlToGroup = (groupId: string, controlName: string, controlType: string) => {
    const newControl: ControlItem = {
      id: `control-${Date.now()}`,
      title: controlName,
      type: controlType,
      isActive: false,
      mode: 'off',
      name: controlName,
      icon: controlType === 'light' ? 'lightbulb' : 'moon'
    };
    
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, controls: [...group.controls, newControl] } 
        : group
    ));
  };

  const deleteControlFromGroup = (groupId: string, controlId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, controls: group.controls.filter(control => control.id !== controlId) } 
        : group
    ));
  };

  const updateControlMode = (groupId: string, controlId: string, mode: 'off' | 'auto' | 'on') => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            controls: group.controls.map(control => {
              if (control.id === controlId) {
                // Default behavior if no auto settings are configured
                let isActive = mode === 'on' || (mode === 'auto' && Math.random() > 0.5);
                
                // If in auto mode and auto settings are configured
                if (mode === 'auto' && control.autoSettings && control.autoSettings.enabled) {
                  // Check if current time is within the configured time range
                  const now = new Date();
                  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                  
                  if (control.autoSettings.startTime && control.autoSettings.endTime) {
                    isActive = currentTime >= control.autoSettings.startTime && currentTime <= control.autoSettings.endTime;
                  }
                }
                
                return { ...control, mode, isActive };
              }
              return control;
            }) 
          } 
        : group
    ));
  };

  // Function to get visible controls based on active group and showAllControls setting
  const getVisibleControls = (): ControlItem[] => {
    if (showAllControls) {
      // Return all controls from all groups
      return groups.flatMap(group => group.controls);
    } else if (activeGroupId) {
      // Return only controls from the active group
      const activeGroup = groups.find(group => group.id === activeGroupId);
      return activeGroup ? activeGroup.controls : [];
    }
    return [];
  };

  const updateAutoSettings = (groupId: string, controlId: string, settings: AutoSettings) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            controls: group.controls.map(control => {
              if (control.id === controlId) {
                const updatedSettings = {
                  ...control.autoSettings,
                  ...settings,
                  startTime: settings.startTime || '00:00',
                  endTime: settings.endTime || '23:59',
                  duration: settings.duration || 0,
                  interval: settings.interval || 0,
                };
                return { ...control, autoSettings: updatedSettings };
              }
              return control;
            })
          }
        : group
    ));
  };

  const value = {
    groups,
    activeGroupId,
    setActiveGroupId,
    showAllControls,
    setShowAllControls,
    addGroup,
    editGroup,
    deleteGroup,
    toggleGroupExpanded,
    addControlToGroup,
    deleteControlFromGroup,
    updateControlMode,
    updateAutoSettings,
    getVisibleControls
  };

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  );
};