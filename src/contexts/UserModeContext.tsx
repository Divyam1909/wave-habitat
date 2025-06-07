import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserMode = 'operator' | 'viewer' | 'programmer';

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  isOperator: () => boolean;
  isProgrammer: () => boolean;
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
  const isProgrammer = () => mode === 'programmer';

  const value = {
    mode,
    setMode,
    isOperator,
    isProgrammer
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
};