import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import AccountMenu from "./account-menu";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleUserHome = () => {
    navigate("/profiles");
  };

  return (
    <header>
      <nav className="bg-zinc-950 border-none dark:bg-gray-900 shadow-shape">
        <div className="w-full flex flex-wrap items-center justify-between mx-auto p-2">
          
          <img onClick={handleUserHome} src={logo} className="h-14 cursor-pointer" alt="Flowbite Logo" />
         
          <div className="flex gap-5">
            <AccountMenu />
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Header;
