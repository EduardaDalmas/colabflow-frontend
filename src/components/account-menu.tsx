import { ChevronDown, CircleUser, Contact, LucideLogOut } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Dialog } from "./ui/dialog"
import { useNavigate } from "react-router-dom"
import { useProfileStore } from "@/store/user"
import { useAuth } from "@/context/authProvider"

export const AccountMenu = () => {
    const navigate = useNavigate()

    const { setLoggedIn } = useProfileStore();
    const { name, email } = useAuth();

    const handleUserLogout = () => {
        setLoggedIn(false);
        navigate("/");
    };

    function setProfile() {
        navigate("/set-profile")
    };

    function account() {
        navigate("/account")
    };

    function goHome() {
        navigate("/")
    }

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 select-none border-zinc-700">
                        Conta
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 bg-zinc-800 border-zinc-700">
                    <DropdownMenuLabel className="flex flex-col hover:bg-indigo-600 rounded" onClick={() => goHome()}>
                        <span>{name}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            {email}
                        </span> 
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem  asChild className="hover:bg-indigo-600 rounded">
                        <button className="w-full" onClick={() => account()}>
                            <CircleUser className="h-4 w-4 mr-2" />
                            <span>Meus dados</span>
                        </button>
                    </DropdownMenuItem>
               
                  
                    <DropdownMenuItem asChild className="hover:bg-indigo-600 rounded">
                        <button className="w-full" onClick={() => setProfile()}>
                            <Contact className="h-4 w-4 mr-2" />
                            <span>Perfis</span>
                        </button>
                    </DropdownMenuItem>
                  

                    <DropdownMenuItem asChild className="text-rose-500 dark:text-rose-400 rounded hover:bg-zinc-700">
                        <button className="w-full" onClick={() => handleUserLogout()}>
                            <LucideLogOut className="h-4 w-4 mr-2" />
                            <span>Sair</span>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Dialog>
    )
}