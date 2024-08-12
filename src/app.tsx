import { RouterProvider } from "react-router-dom";
import "./globals.css";
import { appRouter, authRouter } from "./routes";
import { useProfileStore } from "./store/user";
import { Toaster } from "sonner";

export function App() {
  const { isLoggedIn } = useProfileStore();

  return (
    <>
      <Toaster richColors position="bottom-center" />
      <RouterProvider router={isLoggedIn ? appRouter : authRouter} />
    </>
  );
}
