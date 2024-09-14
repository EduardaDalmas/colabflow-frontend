import { RouterProvider } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { authRouter, appRouter } from './routes'; // Ajuste o caminho conforme necessário

export function App() {
  const { isAuthenticated } = useAuth(); // Obtém o estado de autenticação

  return (
    <RouterProvider router={isAuthenticated ? appRouter : authRouter} />
  );
}
