import { createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "./pages/_layouts/auth";
import { AppLayout } from "./pages/_layouts/app";

import { NotFound } from "./pages/app/404";
import { Home } from "./pages/app/home";
import { SignIn } from "./pages/auth/sign-in";
import { SendToken } from "./pages/auth/send-token";
import { CreateAccount } from "./pages/auth/create-account";
import { SetProfile } from "./pages/app/profiles";
import { Chat } from "./pages/app/chats";
import { Account } from "./pages/app/account";
import { TermsPrivacy } from "./pages/auth/terms-privacy";
import { LandingPage } from "./pages/auth/landing-page";

export const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/sign-in", element: <SignIn /> },
      { path: "/send-token/:email", element: <SendToken /> },
      { path: "/create-account", element: <CreateAccount /> },
      { path: "/terms-privacy", element: <TermsPrivacy /> },
    ],
  },
]);

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/profiles", element: <SetProfile /> },
      { path: "/chat", element: <Chat /> },
      { path: "/account", element: <Account /> },
    ],
  },
]);