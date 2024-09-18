import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Routes for unauthenticated users */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<SignIn />} />
          <Route path="/send-token/:email" element={<SendToken />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/terms-privacy" element={<TermsPrivacy />} />
        </Route>

        {/* Protected routes requiring authentication */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/profiles" element={<ProtectedRoute element={<SetProfile />} />} />
          <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
          <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
        </Route>

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
