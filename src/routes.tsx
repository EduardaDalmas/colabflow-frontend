import { createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "./pages/_layouts/auth";
import { AppLayout } from "./pages/_layouts/app";

import { NotFound } from "./pages/app/404";
import { Home } from "./pages/app/home";
import { SignIn } from "./pages/auth/sign-in";
import { SendToken } from "./pages/auth/send-token";

export const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <SignIn /> },
      { path: "/send-token/:email", element: <SendToken /> },
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
    ],
  },
]);