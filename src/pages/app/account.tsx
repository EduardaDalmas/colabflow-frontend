import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authProvider";
import { AtSign, Mail, MessageCircleCode, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function getInitials(fullName: string) {
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
        const firstInitial = nameParts[0].charAt(0);
        const lastInitial = nameParts[nameParts.length - 1].charAt(0);
        return firstInitial + lastInitial;
    }
    return fullName.charAt(0);
}

export function Account() {
    const navigate = useNavigate();
    const { name, email } = useAuth();

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        navigate('/')
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-medium text-white mb-10">
                Meus dados
            </h1>

            <form
                onSubmit={handleSubmit}
                className='flex flex-col border border-zinc-800 p-10 items-center rounded-2xl shadow-shape justify-center' 
            >
                <div className="flex flex-row items-center mb-4 p-5">
                    <Avatar className="w-20 h-20">
                        <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                            {getInitials(name)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <Mail size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        name='email'
                        type="email" 
                        placeholder="Email"  
                        value={email}
                        disabled
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <User size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        name='name'
                        type="name" 
                        placeholder="Nome"  
                        value={name}
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <AtSign size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        name='link'
                        type="link" 
                        placeholder="Link profile"  
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <MessageCircleCode size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        name='status'
                        type="status" 
                        placeholder="Status"  
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <Button
                    type="submit"
                    className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-10 hover:bg-indigo-500 shadow-shape"
                >
                    Salvar
                </Button>
            </form>
        </div>
    );
}
