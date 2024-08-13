import { Header } from "@/components/header";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />
      <div className="flex flex-1 flex-col gap-4 lg:p-8 p-4 pt-6">
        <Outlet />
      </div>
    </div>
  );
};
