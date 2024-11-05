import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string;
  name: string;
  isLoading: boolean; // Novo estado de carregamento
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  login: (token: string) => void;
  logout: () => void;
}

interface DecodedToken {
  email: string;
  name: string;
  exp: number; // Expiração do token JWT
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Inicializar como false
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Novo estado de carregamento

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
          localStorage.removeItem('user_id');
        }
      } catch (error) {
        console.error("Erro ao decodificar o token", error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');

      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false); // Finaliza o carregamento
  }, [isAuthenticated]);

  const login = (token: string) => {

    try {
      const decoded: DecodedToken = jwtDecode(token);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);

      if (decoded.email && decoded.name) {
        setEmail(decoded.email);
        setName(decoded.name);
      } else {
        console.error("Token não contém os campos email ou name.");
        setIsAuthenticated(false); // Defina como false se os campos forem inválidos
      }
    } catch (error) {
      console.error("Erro ao decodificar o token", error);
      setIsAuthenticated(false); // Defina como false em caso de erro
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);

    setEmail('');
    setName('');
  };

  

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, name, isLoading, setEmail, setName, login, logout }}>
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
