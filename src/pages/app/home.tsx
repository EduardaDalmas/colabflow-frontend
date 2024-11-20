import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getGroups } from "@/http/get-groups";
import { getGroupByChatUser } from "@/http/get-groups";
import { createGroup } from "@/http/create-group";
import { editGroup } from "@/http/edit-group";
import { deleteGroup } from "@/http/delete-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, CirclePlus, Edit, Trash2, Users } from "lucide-react"
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Groups {
    id: string;
    name: string;
    priority: {
        id: string;
        name: string;
    }
}

interface Group {
    id: string;
    name: string;
    priority: {
        id: string;
        name: string;
    };
    notifications: number;
}

// Função para pegar o nome do profile salvo no localStorage
const getProfileName = (): string | null => {
    return localStorage.getItem('profile_name');
}


const getInitials = (name: string): string => {
    if (!name || typeof name !== 'string') {
        return ''; // Retorna uma string vazia se o nome não for válido
    }

    const words = name.trim().split(' '); // Remove espaços desnecessários e divide o nome

    if (words.length === 1) {
        // Quando houver apenas uma palavra, pegar a primeira e segunda letras
        const singleWord = words[0];
        return (singleWord[0] + (singleWord[1] || '')).toUpperCase();
    }

    // Quando houver mais de uma palavra, pegar a primeira e última inicial
    const firstInitial = words[0][0];
    const lastInitial = words[words.length - 1][0];

    return (firstInitial + lastInitial).toUpperCase();
};

export function Home() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Groups[]>([]);
    // grupos em que sou participante
    const [groupsByChatUser, setGroupsByChatUser] = useState<Groups[]>([]);

    const [newGroupName, setNewGroupName] = useState(''); // Estado para o novo perfil
    // @ts-ignore
    const [groupError, setGroupError] = useState('');
    // @ts-ignore
    const [groupSucess, setGroupSucess] = useState('');
    // @ts-ignore
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('user_id')); // Obtém o ID do usuário do localStorage
    //pega o id do perfil na URL
    const { id_context } = useParams<{ id_context?: string }>(); // Tipagem para id_group como string ou undefined

    // const groupedByPriority: { [key: string]: Group[] } = groups.reduce((acc, group) => {
    //     const priorityName = group.priority.name;
    //     if (!acc[priorityName]) acc[priorityName] = [];
    //     acc[priorityName].push(group);
    //     return acc;
    // }, {} as { [key: string]: Group[] });

    // const priorityOrder: ('Urgente' | 'Alta' | 'Média' | 'Baixa')[] = ['Urgente', 'Alta', 'Média', 'Baixa'];

    const priorityOrder = [
        { id: 1, label: 'Urgente' },
        { id: 2, label: 'Alta' },
        { id: 3, label: 'Média' },
        { id: 4, label: 'Baixa' }
    ];

    const groupedByPriority: { [key: string]: Group[] } = groups.reduce((acc, group) => {
        const priorityName = group.priority.name;
        if (!acc[priorityName]) acc[priorityName] = [];
        // @ts-ignore
        acc[priorityName].push(group);
        return acc;
    }, {} as { [key: string]: Group[] });

    // grupos de participantes
    const groupedByPriorityChatUser: { [key: string]: Group[] } = groupsByChatUser.reduce((acc, group) => {
        const priorityName = group.priority.name;
        if (!acc[priorityName]) acc[priorityName] = [];
        // @ts-ignore
        acc[priorityName].push(group);
        return acc;
    }, {} as { [key: string]: Group[] });



    // Agora, as prioridades serão ordenadas conforme o array `priorityOrder`
    const sortedGroupedByPriority = priorityOrder.map(priority => ({
        priority,
        groups: groupedByPriority[priority.label] || []  // Garante que, caso não haja grupos para a prioridade, o array não será undefined
    }));

    // grupos de participantes
    const sortedGroupedByPriorityChatUser = priorityOrder.map(priority => ({
        priority,
        groups: groupedByPriorityChatUser[priority.label] || []  // Garante que, caso não haja grupos para a prioridade, o array não será undefined
    }));

    async function fetchGroups() {
        try {
            const data = await getGroups({ id_user: userId, id_context: id_context });
            setGroups(data);
        } catch (error) {
            console.error('Erro ao buscar grupos:', error);
        }
    }

    async function fetchGroupsByChatUser() {
        try {
            const data = await getGroupByChatUser({ id_user: userId });
            setGroupsByChatUser(data);
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

    useEffect(() => {
        if (userId) {
            fetchGroupsByChatUser();
        } else {
            setGroupsByChatUser([]); // Se o usuário não estiver logado, zera os perfis
        }
    }, [userId]); // Reexecuta sempre que userId mudar




    async function handleCreateGroup(priority: { id: any; label: any }) {
        if (newGroupName.trim() === '') {
            setGroupError('Nome do grupo não pode estar vazio.');
            return;
        }

        try {
            const response = await createGroup({ name: newGroupName, id_context: id_context, id_user: userId, id_priority: priority.id }); // Cria o perfil no backend
            toast.success('Grupo criado com sucesso!');
            setTimeout(() => {
                setGroupSucess('');
            }, 3000); // 3 segundos

            // Atualiza a lista de grupos localmente sem precisar de F5
            // @ts-ignore
            const newGroup = {
                // @ts-ignore
                id: response.id, name: newGroupName, id_context: response.id_context, priority: {
                    id: priority.id, // A prioridade default ou retornada
                    name: priority.label // A prioridade default ou retornada
                }
            }; // Assumindo que o backend retorna o id do novo grupo
            fetchGroups();
            setGroups((prevGroups) => [...prevGroups, newGroup]); // Adiciona o novo grupo ao estado de grupos

            setNewGroupName(''); // Limpa o campo
            setGroupError(''); // Limpa erros
        } catch (error) {
            setGroupError('Erro ao criar Grupo, tente novamente.');
            setTimeout(() => {
                setGroupError('');
            }, 3000); // 3 segundos
        }
    }


    function openChats(group: Groups) {
        localStorage.setItem('group_name', group.name);
        // Passa o id ou chat_name como parte da URL
        navigate(`/chat/${group.id}`); // ou `/chat/${chatName}`, dependendo do que você deseja usar
    }

    function handleEditgroupName(id: string, name: string) {
        const newGroups = groups.map((group) => {
            if (group.id === id) {
                return { ...group, name };
            }
            return group;
        });

        setGroups(newGroups);
    }

    async function handleSavegroup(id: string) {
        const group = groups.find((group) => group.id === id);

        if (!group) {
            return;
        }

        try {
            // @ts-ignore
            await editGroup({ id: group.id, name: group.name, id_user: userId });
            toast.success('Grupo editado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar grupo:', error);
            toast.error('Erro ao salvar grupo. Tente novamente!');
        }
    }

    async function handleDeletegroup(id: string) {
        console.log('id', id);
        try {
            await deleteGroup({ id });
            toast.success('Grupo excluído com sucesso!');
            fetchGroups();
        } catch (error) {
            console.error('Erro ao excluir grupo:', error);
            toast.error('Erro ao excluir grupo. Tente novamente!');
        }

        closeDialog();
    }

    function closeDialog() {
        // Fecha todos os diálogos abertos
        const dialogs = document.querySelectorAll('.dialog');
        dialogs.forEach((dialog) => {
            dialog.dispatchEvent(new CustomEvent('dialog:close'));
        });
    }


    return (
        <div className="flex flex-col items-center justify-center">
            <ToastContainer />
            <h1 className="text-2xl font-medium text-white mb-10">
                {getProfileName()} - Equipes
            </h1>


            <Tabs defaultValue="account" className="flex flex-col h-full w-2/3">
                <TabsList className="flex lg:mb-5 mb-1 bg-transparent border border-zinc-700 bg-zinc-950 rounded-2xl min-h-12 shadow-shape">
                    <TabsTrigger value="account" className="flex-1 rounded-2xl min-h-10">Meus Grupos</TabsTrigger>
                    <TabsTrigger value="password" className="flex-1 rounded-2xl min-h-10">Sou Convidado</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto">
                    <TabsContent value="account" className="w-full">
                        {sortedGroupedByPriority.map(({ priority, groups }) => (
                            <div key={priority.id}>
                                <div className="flex flex-row gap-1 mt-4">
                                    <p className="font-bold text-lg pl-3">{priority.label}</p>
                                    {/* Ícone de prioridade */}
                                    {priority.label === 'Urgente' && <Bookmark size={24} className="text-purple-600" />}
                                    {priority.label === 'Alta' && <Bookmark size={24} className="text-red-600" />}
                                    {priority.label === 'Média' && <Bookmark size={24} className="text-yellow-600" />}
                                    {priority.label === 'Baixa' && <Bookmark size={24} className="text-green-600" />}
                                </div>

                                <div className="flex flex-row flex-wrap">

                                    {
                                        groups.map(group => (
                                            <div key={group.id} className="mb-4 p-5 text-center items-center cursor-pointer group">

                                                <div className="relative inline-block">
                                                    {/* Avatar */}
                                                    <Avatar className="w-20 h-20" onClick={() => openChats(group)}>
                                                        <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                                            {getInitials(group.name)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    {/* Bolinha de notificação */}
                                                    {group.notifications > 0 && (
                                                        <span className="absolute top-0 right-0 inline-block w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                                                            {group.notifications}
                                                        </span>
                                                    )}

                                                    <p className="text-white text-center text-xs mt-2">{group.name}</p>
                                                </div>

                                                <div className="top-2 -right-2 p-2 bg-gray-800 rounded-full flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <button className="text-white hover:text-indigo-400" id="editGroup" onClick={(e) => e.stopPropagation()}>
                                                                <Edit size={16} />
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                                                            <DialogHeader>
                                                                <DialogTitle>Editar grupo</DialogTitle>
                                                                <DialogDescription className="text-zinc-300">
                                                                    Edite as informações do grupo.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                                                                    <Users size={24} className="absolute left-3 text-gray-400" />
                                                                    <Input
                                                                        id="groupNameEdit"
                                                                        name='groupName'
                                                                        type="text"
                                                                        value={group.name}
                                                                        onChange={(e) => handleEditgroupName(group.id, e.target.value)}
                                                                        placeholder="Nome do grupo"
                                                                        className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600" id="saveGroup" onClick={() => handleSavegroup(group.id)}>
                                                                    Salvar alterações
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <button className="text-white hover:text-red-400" id="openDeleteGroup" onClick={(e) => e.stopPropagation()}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                                                            <DialogHeader>
                                                                <DialogTitle>Confirmar exclusão</DialogTitle>
                                                                <DialogDescription className="text-zinc-300">
                                                                    Tem certeza de que deseja excluir o grupo "{group.name}"? Esta ação não pode ser desfeita.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <Button className="border border-zinc-600 hover:bg-red-600" id="deleteGroup" onClick={() => handleDeletegroup(group.id)}>
                                                                    Excluir
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        ))
                                    }

                                    {/* Botão de "Novo" para adicionar grupo */}
                                    <div className="mb-4 p-5 text-center items-center cursor-pointer">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div>
                                                    <CirclePlus className="cursor-pointer hover:text-indigo-500 w-20 h-20" />
                                                    <p className="text-white text-center text-xs mt-2 max-w-20" id={`novo_${priority.label}`}>Novo</p>
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
                                                            id="groupNameCreate"
                                                            name='groupName'
                                                            type="groupName"
                                                            value={newGroupName}
                                                            onChange={(e) => setNewGroupName(e.target.value)}
                                                            placeholder="Nome do grupo"
                                                            className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600" id="createGroup" onClick={() => handleCreateGroup(priority)}>Criar novo grupo</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="password" className="w-full">


                        {sortedGroupedByPriorityChatUser.map(({ priority, groups }) => (
                            <div key={priority.id}>
                                <div className="flex flex-row gap-1 mt-4">
                                    <p className="font-bold text-lg pl-3">{priority.label}</p>
                                    {/* Ícone de prioridade */}
                                    {priority.label === 'Urgente' && <Bookmark size={24} className="text-purple-600" />}
                                    {priority.label === 'Alta' && <Bookmark size={24} className="text-red-600" />}
                                    {priority.label === 'Média' && <Bookmark size={24} className="text-yellow-600" />}
                                    {priority.label === 'Baixa' && <Bookmark size={24} className="text-green-600" />}
                                </div>

                                <div className="flex flex-row flex-wrap">
                                    {groups.map(group => (
                                        <div key={group.id} className="mb-4 p-5 text-center items-center cursor-pointer group">
                                            <div className="relative inline-block">
                                                {/* Avatar */}
                                                <Avatar className="w-20 h-20" onClick={() => openChats(group)}>
                                                    <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                                        {getInitials(group.name)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                {/* Bolinha de notificação */}
                                                {group.notifications > 0 && (
                                                    <span className="absolute top-0 right-0 inline-block w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                                                        {group.notifications}
                                                    </span>
                                                )}

                                                {/* Nome do grupo */}
                                                <p className="text-white text-center text-xs mt-2 max-w-20">{group.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}




                    </TabsContent>


                </div>
            </Tabs>


        </div>
    )
}