import { createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "./pages/_layouts/auth";
import { AppLayout } from "./pages/_layouts/app";

import { NotFound } from "./pages/app/404";
import { Home } from "./pages/app/home";
import { SignIn } from "./pages/auth/sign-in";
import { SendToken } from "./pages/auth/send-token";
import { CreateAccount } from "./pages/auth/create-account";
import { SetProfile } from "./pages/app/set-profile";
import { Chat } from "./pages/app/chats";
import { Account } from "./pages/app/account";

export const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <SignIn /> },
      { path: "/send-token/:email", element: <SendToken /> },
      { path: "/create-account", element: <CreateAccount /> },
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
      { path: "/set-profile", element: <SetProfile /> },
      { path: "/chat", element: <Chat /> },
      { path: "/account", element: <Account /> },
    ],
  },
]);