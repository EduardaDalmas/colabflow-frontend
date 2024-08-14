import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getGroups } from "@/http/get-groups";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CirclePlus } from "lucide-react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Groups {
    id: string;
    name: string;
}

function getInitials(fullName: string) {
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
        const firstInitial = nameParts[0].charAt(0);
        const lastInitial = nameParts[nameParts.length - 1].charAt(0);
        return firstInitial.toUpperCase() + lastInitial.toUpperCase();
    }
    return fullName.charAt(0);
}

export function Home() {
    const navigate = useNavigate();

    const [groups, setGroups] = useState<Groups[]>([]);

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const data = await getGroups();
                setGroups(data); // Aqui data deve ser do tipo Profile[]
            } catch (error) {
                console.error('Erro ao buscar perfis:', error);
            }
        }

        fetchProfiles();
    }, []);

    function openChats() {
        navigate("/chat");
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-medium text-white mb-10">
                Minhas equipes
            </h1>

           
           <Tabs defaultValue="account" className="flex flex-col h-full w-2/3">
                <TabsList className="flex lg:mb-5 mb-1 bg-transparent border border-zinc-700 bg-zinc-950 rounded-2xl min-h-12">
                    <TabsTrigger value="account"  className="flex-1 rounded-2xl min-h-10">Meus Grupos</TabsTrigger>
                    <TabsTrigger value="password"  className="flex-1 rounded-2xl min-h-10">Sou Participante</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto">
                    <TabsContent value="account" className="w-full">
                        <div className="flex flex-row gap-4">
                            <p className="font-medium text-lg pl-3">Alta Prioridade</p>
                        </div>

                        <div className="flex flex-row">
                            {groups.map(profile => (
                                <div key={profile.id} className="mb-4 p-5 text-center items-center cursor-pointer" onClick={openChats}>
                                    <Avatar className="w-20 h-20 ">
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
                    </TabsContent>

                    <TabsContent value="password" className="w-full">
                        <div className="flex flex-row gap-4">
                            <p className="font-medium text-lg pl-3">Alta Prioridade 2</p>
                        </div>

                        <div className="flex flex-row">
                            {groups.map(profile => (
                                <div key={profile.id} className="mb-4 p-5 text-center items-center">
                                    <Avatar className="cursor-pointer w-20 h-20 ">
                                        <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                            {getInitials(profile.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-white text-center text-xs mt-2 max-w-20">{profile.name}</p>
                                </div>
                            ))}
                            <div className="mb-4 p-5 text-center items-center">
                                <CirclePlus className="cursor-pointer hover:text-indigo-500 w-20 h-20" />
                                <p className="text-white text-center text-xs mt-2 max-w-20">Novo</p>
                            </div>
                        </div>
                        
                    </TabsContent>
                </div>
            </Tabs>
           

        </div>
    )
}