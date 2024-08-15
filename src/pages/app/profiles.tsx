import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProfiles } from '@/http/get-profiles';
import { CirclePlus, Users } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

interface Profile {
    id: string;
    name: string;
}

function getInitials(fullName: string) {
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
        const firstInitial = nameParts[0].charAt(0);
        const lastInitial = nameParts[nameParts.length - 1].charAt(0);
        return firstInitial + lastInitial;
    }
    return fullName.charAt(0);
}

export function SetProfile() {
    // Inicialize o estado com o tipo correto
    const [profiles, setProfiles] = useState<Profile[]>([]);

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const data = await getProfiles();
                setProfiles(data); // Aqui data deve ser do tipo Profile[]
            } catch (error) {
                console.error('Erro ao buscar perfis:', error);
            }
        }

        fetchProfiles();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-medium text-white mb-10">
                Selecione o perfil (contexto)
            </h1>

            <div className="flex flex-row items-center">
                {profiles.map(profile => (
                    <div key={profile.id} className="mb-4 p-5 cursor-pointer">
                        <Avatar className="w-20 h-20">
                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                {getInitials(profile.name)}
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-white text-center text-xs mt-2 max-w-20">{profile.name}</p>
                    </div>
                ))}
                 <div className="mb-4 p-5 text-center items-center cursor-pointer">
                   <Dialog>
                        <DialogTrigger asChild>
                            <div>
                                <CirclePlus className="cursor-pointer hover:text-indigo-500 w-20 h-20" />
                                <p className="text-white text-center text-xs mt-2 max-w-20">Novo</p>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                            <DialogHeader>
                            <DialogTitle>Novo perfil</DialogTitle>
                            <DialogDescription className="text-zinc-300">
                                Crie novos perfis para gerenciar seus grupos.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm ">
                                    <Users size={24} className="absolute left-3 text-gray-400" />
                                    <Input 
                                        name='profileName'
                                        type="profileName" 
                                        placeholder="Nome do perfil"  
                                        className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600">Criar novo perfil</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
