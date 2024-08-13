import logo from "@/assets/logo.png";
import { useProfileStore } from "@/store/user";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { setLoggedIn } = useProfileStore();
  const navigate = useNavigate();

  const handleUserLogout = () => {
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <header>
      <nav className="bg-slate-950 border-none dark:bg-gray-900">
        <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4 px-12">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} className="h-20" alt="Flowbite Logo" />
          </a>
          <button
            onClick={() => handleUserLogout()}
            type="button"
            className="md:hidden"
          >
            <LogOut className="w-5 h-5 md:mt-0 md:ml-2 mt-2 text-white" />
          </button>
        </div>
      </nav>
    </header>
  );
};
