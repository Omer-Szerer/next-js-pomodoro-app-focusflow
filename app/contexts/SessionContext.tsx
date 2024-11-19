'use client';

import React, { createContext, type ReactNode, useContext } from 'react';

// Define the type for the sessionToken
type SessionContextType = boolean | null;

// Define the props for the SessionProvider
interface SessionProviderProps {
  sessionToken: SessionContextType;
  children: ReactNode;
}

// Create a context with the proper type and a default value
const sessionContext = createContext<SessionContextType>(null);

// Custom hook to access the context
export const useSession = (): SessionContextType => {
  return useContext(sessionContext); // No unnecessary checks required
};

// Provider component
export const SessionProvider: React.FC<SessionProviderProps> = ({
  sessionToken,
  children,
}) => {
  return (
    <sessionContext.Provider value={sessionToken}>
      {children}
    </sessionContext.Provider>
  );
};
