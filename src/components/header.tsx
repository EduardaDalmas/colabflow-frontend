import logo from "@/assets/logo.png";
import { useProfileStore } from "@/store/user";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "./ui/button";


export const Header = () => {
  const { setLoggedIn } = useProfileStore();
  const navigate = useNavigate();

  const handleUserLogout = () => {
    setLoggedIn(false);
    navigate("/");
  };

  const handleUserHome = () => {
    navigate("/");
  };

  return (
    <header>
      <nav className="bg-slate-950 border-none dark:bg-gray-900">
        <div className="w-full flex flex-wrap items-center justify-between mx-auto p-2">
          
          <img onClick={handleUserHome} src={logo} className="h-14 cursor-pointer" alt="Flowbite Logo" />
         
          <div className="flex gap-5">
            <Button 
              onClick={() => navigate("/set-profile")}
              className="bg-indigo-600 border-none text-base text-white font-bold rounded-2xl h-auto w-auto hover:bg-indigo-700"
            >
              Perfis
            </Button>
            <button
              onClick={() => handleUserLogout()}
              type="button"
            >
            
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <LogOut className="w-5 h-5 md:mt-0 md:ml-2 mt-2 text-white" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-950">
                    <p>Efetuar logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </button>  
          </div>
        </div>
      </nav>
    </header>
  );
};
