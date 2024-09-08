import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <div className="flex flex-1 flex-col gap-4 justify-center">
        <Outlet />
      </div>
    </div>
  );
};
