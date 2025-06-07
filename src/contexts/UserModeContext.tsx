import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserMode = 'operator' | 'viewer';

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  isOperator: () => boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
};

interface UserModeProviderProps {
  children: ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<UserMode>('operator');

  const isOperator = () => mode === 'operator';

  const value = {
    mode,
    setMode,
    isOperator
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};