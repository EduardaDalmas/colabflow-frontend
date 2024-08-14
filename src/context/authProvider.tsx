import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  email: string;
  name: string;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');

  return (
    <AuthContext.Provider value={{ email, setEmail, name, setName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
