import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from './pages/_layouts/auth';
import { AppLayout } from './pages/_layouts/app';
import ProtectedRoute from './context/ProtectedRoute';
import { NotFound } from './pages/app/404';
import { Home } from './pages/app/home';
import { SignIn } from './pages/auth/sign-in';
import { SendToken } from './pages/auth/send-token';
import { CreateAccount } from './pages/auth/create-account';
import { SetProfile } from './pages/app/profiles';
import { Chat } from './pages/app/chats';
import { Account } from './pages/app/account';
import { TermsPrivacy } from './pages/auth/terms-privacy';

export const authRouter = createBrowserRouter([ // Rotas para usuários não autenticados
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <SignIn /> },
      { path: "/send-token/:email", element: <SendToken /> },
      { path: "/create-account", element: <CreateAccount /> },
      { path: "/terms-privacy", element: <TermsPrivacy /> },
    ],
  },
]);

export const appRouter = createBrowserRouter([ // Rotas para usuários autenticados
  {
    path: "/", 
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <ProtectedRoute element={<Home />} />},
      { path: "/profiles", element: <ProtectedRoute element={<SetProfile />} /> },
      { path: "/send-token/:email", element: <SendToken /> }, //provisorio
      { path: "/chat", element: <ProtectedRoute element={<Chat />} /> },
      { path: "/account", element: <ProtectedRoute element={<Account />} /> },
    ],
  },
  
]);

