import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string;
  name: string;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  login: (token: string) => void; // Ajustado para receber o token JWT
  logout: () => void;
}

interface DecodedToken {
  email: string;
  name: string;
  exp: number; // Expiração do token JWT
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Iniciar como false
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp > currentTime) {
          setIsAuthenticated(true);
          setEmail(decoded.email || '');
          setName(decoded.name || '');
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Erro ao decodificar o token", error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token: string) => {
    console.log('Token recebido:', token); // Verifique se o token está correto

    try {
      const decoded: DecodedToken = jwtDecode(token);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      // Verifique se o token contém os campos email e name
    if (decoded.email && decoded.name) {
      setEmail(decoded.email);
      setName(decoded.name);
    } else {
      console.error("Token não contém os campos email ou name.");
    }
      setEmail(decoded.email);
      setName(decoded.name);
    } catch (error) {
      console.error("Erro ao decodificar o token", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setEmail('');
    setName('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, name, setEmail, setName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};