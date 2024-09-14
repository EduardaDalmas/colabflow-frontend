import { RouterProvider } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { authRouter, appRouter } from './routes'; // Ajuste o caminho conforme necessário

export function App() {
  const { isAuthenticated, isLoading } = useAuth(); // Obtém o estado de autenticação e carregamento

  if (isLoading) {
    return <div>Loading...</div>; // Exiba um loader ou uma tela de carregamento
  }

  return (
    <RouterProvider router={isAuthenticated ? appRouter : authRouter} /> // Use a rota apropriada com base no estado de autenticação
  );
}
