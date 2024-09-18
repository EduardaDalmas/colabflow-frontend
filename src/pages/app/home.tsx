import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getGroups } from "@/http/get-groups";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, CirclePlus, Users } from "lucide-react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface Groups {
    id: string;
    name: string;
}

const getInitials = (name: string): string => {
    if (!name || typeof name !== 'string') {
        return '';
    }

    const words = name.split(' ');
    if (words.length === 0) {
        return '';
    }

    // Pegando a primeira e a última inicial
    const firstInitial = words[0][0];
    const lastInitial = words[words.length - 1][0];

    return (firstInitial + lastInitial).toUpperCase();
};    

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
                <TabsList className="flex lg:mb-5 mb-1 bg-transparent border border-zinc-700 bg-zinc-950 rounded-2xl min-h-12 shadow-shape">
                    <TabsTrigger value="account"  className="flex-1 rounded-2xl min-h-10">Meus Grupos</TabsTrigger>
                    <TabsTrigger value="password"  className="flex-1 rounded-2xl min-h-10">Sou Participante</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto">
                    <TabsContent value="account" className="w-full">
                        <div className="flex flex-row gap-1">
                            <p className="font-bold text-lg pl-3">Alta Prioridade</p>
                            <Bookmark size={24} className="text-red-600" />
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
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div>
                                            <CirclePlus className="cursor-pointer hover:text-indigo-500 w-20 h-20" />
                                            <p className="text-white text-center text-xs mt-2 max-w-20">Novo</p>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                                        <DialogHeader>
                                        <DialogTitle>Novo grupo</DialogTitle>
                                        <DialogDescription className="text-zinc-300">
                                            Crie novos grupos para gerenciar suas equipes.
                                        </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm ">
                                                <Users size={24} className="absolute left-3 text-gray-400" />
                                                <Input 
                                                    name='groupName'
                                                    type="groupName" 
                                                    placeholder="Nome do grupo"  
                                                    className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600">Criar novo grupo</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="password" className="w-full">
                        <div className="flex flex-row gap-4">
                            <p className="font-medium text-lg pl-3">Alta Prioridade 2</p>
                        </div>

                        <div className="flex flex-row">
                            {groups.map(profile => (
                                <div key={profile.id} className="mb-4 p-5 text-center items-center" onClick={openChats}>
                                    <Avatar className="cursor-pointer w-20 h-20 ">
                                        <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                            {getInitials(profile.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-white text-center text-xs mt-2 max-w-20">{profile.name}</p>
                                </div>
                            ))}
                            <div className="mb-4 p-5 text-center items-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div>
                                            <CirclePlus className="cursor-pointer hover:text-indigo-500 w-20 h-20" />
                                            <p className="text-white text-center text-xs mt-2 max-w-20">Novo</p>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                                        <DialogHeader>
                                        <DialogTitle>Novo grupo</DialogTitle>
                                        <DialogDescription className="text-zinc-300">
                                            Crie novos grupos para gerenciar suas equipes.
                                        </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm ">
                                                <Users size={24} className="absolute left-3 text-gray-400" />
                                                <Input 
                                                    name='groupName'
                                                    type="groupName" 
                                                    placeholder="Nome do grupo"  
                                                    className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600">Criar novo grupo</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        
                    </TabsContent>
                </div>
            </Tabs>
           

        </div>
    )
}