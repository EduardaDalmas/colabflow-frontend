import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProfiles } from '@/http/get-profiles';
import { CirclePlus } from 'lucide-react';
 // Ajuste o caminho conforme necessário

// Defina o tipo do perfil
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
            <h1 className="text-xl font-bold text-white mb-5">
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
                    <CirclePlus className="hover:text-indigo-500  w-20 h-20" />
                    <p className="text-white text-center text-xs mt-2 max-w-20">Novo</p>
                </div>
            </div>
        </div>
    );
}
