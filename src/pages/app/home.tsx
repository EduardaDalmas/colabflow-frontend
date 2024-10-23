import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getGroups } from "@/http/get-groups";
import { createGroup } from "@/http/create-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, CirclePlus, Users } from "lucide-react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
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
    const [newGroupName, setNewGroupName] = useState(''); // Estado para o novo perfil
    // @ts-ignore
    const [groupError, setGroupError] = useState('');
    // @ts-ignore
    const [groupSucess, setGroupSucess] = useState('');
    // @ts-ignore
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('user_id')); // Obtém o ID do usuário do localStorage
    //pega o id do perfil na URL
    const { id_context } = useParams<{ id_context?: string }>(); // Tipagem para id_profile como string ou undefined


        async function fetchGroups() {
            try {
                const data = await getGroups({ id_user: userId , id_context: id_context});
                setGroups(data); 
            } catch (error) {
                console.error('Erro ao buscar grupos:', error);
            }
        }

            // Observa mudanças no ID do usuário
        useEffect(() => {
            if (userId) {
                fetchGroups();
            } else {
                setGroups([]); // Se o usuário não estiver logado, zera os perfis
            }
        }, [userId]); // Reexecuta sempre que userId mudar


        
    async function handleCreateGroup() {
        if (newGroupName.trim() === '') {
            setGroupError('Nome do grupo não pode estar vazio.');
            return;
        }
    
        try {
            const response = await createGroup({ name: newGroupName, id_context: id_context, id_user: userId , id_priority: '3'}); // Cria o perfil no backend
            setGroupSucess('Grupo criado com sucesso!');
    
            // Atualiza a lista de grupos localmente sem precisar de F5
            // @ts-ignore
            const newGroup = { id: response.id, name: newGroupName, id_context: response.id_context}; // Assumindo que o backend retorna o id do novo grupo
            setGroups((prevGroups) => [...prevGroups, newGroup]); // Adiciona o novo grupo ao estado de grupos
    
            setNewGroupName(''); // Limpa o campo
            setGroupError(''); // Limpa erros
        } catch (error) {
            setGroupError('Erro ao criar Grupo, tente novamente.');
        }
    }


    function openChats(group: Groups) {
        console.log('Abrindo chat:', group.name);
        localStorage.setItem('group_name', group.name);
        // Passa o id ou chat_name como parte da URL
        navigate(`/chat/${group.id}`); // ou `/chat/${chatName}`, dependendo do que você deseja usar
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
                            {groups.map(group => (
                                <div key={group.id} className="mb-4 p-5 text-center items-center cursor-pointer" onClick={() => openChats(group)}>
                                <Avatar className="w-20 h-20 ">
                                        <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                            {getInitials(group.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-white text-center text-xs mt-2 max-w-20">{group.name}</p>
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
                                                    value={newGroupName}
                                                    onChange={(e) => setNewGroupName(e.target.value)} // Captura o nome do novo grupo                                                    placeholder="Nome do grupo"  
                                                    className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600" onClick={handleCreateGroup}>Criar novo grupo</Button>
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
                            {groups.map(group => (
                                // @ts-ignore
                                <div key={group.id} className="mb-4 p-5 text-center items-center" onClick={openChats}>
                                    <Avatar className="cursor-pointer w-20 h-20 ">
                                        <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                            {getInitials(group.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-white text-center text-xs mt-2 max-w-20">{group.name}</p>
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
                                                    value={newGroupName}
                                                    onChange={(e) => setNewGroupName(e.target.value)} // Captura o nome do novo grupo          
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