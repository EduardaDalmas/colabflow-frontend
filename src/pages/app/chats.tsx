import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { getChats } from '@/http/get-chat';
import { getUserChats } from '@/http/get-chat';
import { createUserChat } from '@/http/create-chat';
import { getLinks } from '@/http/get-link';
import { createLink } from '@/http/create-link';
import { deleteLink } from '@/http/delete-link';
import { deleteUserChat } from '@/http/delete-userchat';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
// @ts-ignore
import { Archive, CirclePlus, HardDriveDownload, Info, Link2, ListCollapse, MessageCircleWarning, SendHorizonal, Settings, UserPlus2, Users, Plus, Trash2, CircleX, Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { createChat } from "@/http/create-chat";
import { editChat } from '@/http/edit-chat';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator';
import { Button } from "@/components/ui/button";
import { useParams } from 'react-router-dom';
// @ts-ignore
import { set } from 'react-hook-form';


const socket = io('http://localhost:3001', {
    reconnectionAttempts: 5,  // Número de tentativas de reconexão
    reconnectionDelay: 1000,  // Intervalo entre as tentativas
    reconnectionDelayMax: 5000,  // Intervalo máximo entre as tentativas
    upgrade: false,  // Não tentar atualizar a conexão

});



interface Message {
    authorId: string;
    author: string;
    text: string;
    data: string;
    hora: string;
}

interface Chat {
    id_user: string;
    name: string;
    id_group: string | null;
    id_priority: string;
}

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [chatUsers, setChatUsers] = useState<Chat[]>([]);
    const [newChatUsers, setNewChatUsers] = useState('');
    const [message, setMessage] = useState('');
    const [isTeamsOpen, setIsTeamsOpen] = useState(false);
    const [chatName, setChatName] = useState('');
    const { name } = useAuth();
    const currentRoom = useRef(chatName); // Guarda a sala atual
    const { id_group } = useParams<{ id_group?: string }>(); // Tipagem para id_group como string ou undefined
    const groupId = id_group ?? null; // Se id_group for undefined, define como null
    const [newChat, setNewChat] = useState('');
    // @ts-ignore
    const [chatError, setChatError] = useState('');
    // @ts-ignore
    const [chatSucess, setChatSucess] = useState('');
    // @ts-ignore
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('user_id')); // Obtém o ID do usuário do localStorage
    const [priority, setPriority] = useState<string>(''); // Estado para a prioridade do chat
    const [links, setLinks] = useState<any[]>([]);
    const [newLink, setNewLink] = useState('');
    const [chatId, setChatId] = useState<any>(null);
    // @ts-ignore
    const [groupName, setGroupName] = useState<string | null>(localStorage.getItem('group_name')); // Obtém o ID do usuário do localStorage
    // @ts-ignore
    const [deleteLinkSucess, setDeleteLinkSucess] = useState('');
    // @ts-ignore
    const selectRef = useRef(null);
    //chatUserError
    const [chatUserError, setChatUserError] = useState('');
    //chatUserSucess
    const [chatUserSucess, setChatUserSucess] = useState('');


    //função para buscar chats
    async function fetchChats() {
        try {
            const data = await getChats({ id_group: groupId, id_user: userId });
            setChats(data);
        } catch (error) {
            console.error('Erro ao buscar chats:', error);
        }
    }

    //função para buscar participantes de cada chat
    async function fetchChatUsers() {
        try {
            const data = await getUserChats({ id_chat: chatId.id });
            setChatUsers(data);
        } catch (error) {
            console.error('Erro ao buscar chats:', error);
        }
    }

    //função para buscar links
    async function fetchLinks() {
        try {
            const data = await getLinks({ id_chat: chatId.id });
            setLinks(data);
            console.log(data);
        } catch (error) {
            console.log(chatId.id);
            console.error('Erro ao buscar links:', error);
        }
    }


    const toggleTeams = () => setIsTeamsOpen(prev => !prev);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.on('connect', () => {
            console.log('Conectado ao WebSocket');
            console.log(id_group);

            //conecta ao chat geral ao iniciar
            socket.emit('join_room', chatName);
        });

        //evento recebimento de mensagens
        socket.on('received_message', (data) => {
            //verifica a sala da mensagem
            setMessages((prevMessages) => {
                return [...prevMessages, data];
            });

        });

        //evento room_history recebimento de historico do chat
        socket.on('room_history', (data) => {
            setMessages(data);
            console.log(data);
        });

        socket.emit('set_username', name);

        return () => {
            socket.disconnect();
        }
    }, [name]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (groupId) {
            fetchChats();
        } else {
            setChats([]);
        }
    }, [groupId]);

    useEffect(() => {
        if (chatId) {
            fetchLinks();
        } else {
            setLinks([]);
        }
    }, [chatId]);

    useEffect(() => {
        if (chatId) {
            fetchChatUsers();
        } else {
            setChatUsers([]);
        }
    }, [chatId]);



    async function handleCreateChat() {
        if (newChat.trim() === '') {
            setChatError('Nome do chat não pode estar vazio.');
            return;
        }

        try {
            // @ts-ignore
            const response = await createChat({ id_user: userId, name: newChat, id_group: groupId, id_priority: priority });
            setChatSucess('Chat criado com sucesso!');

            // Atualiza a lista de grupos localmente sem precisar de F5
            const newChatTeam = { id_user: userId, name: newChat, id_group: groupId, id_priority: priority }; // Assumindo que o backend retorna o id do novo grupo
            // @ts-ignore
            setChats((prevChats) => [...prevChats, newChatTeam]); // Adiciona o novo grupo ao estado de grupos

            setNewChat(''); // Limpa o campo
            setChatError(''); // Limpa erros
        } catch (error) {
            setChatError('Erro ao criar chat, tente novamente.');
        }
    }

    async function handleEditChat() {
        if (newChat.trim() === '') {
            setChatError('Nome do chat não pode estar vazio.');
            return;
        }

        try {
            // @ts-ignore
            const response = await editChat({ id_user: userId, name: chatName, id_group: groupId, id_priority: priority });
            setChatSucess('Chat criado com sucesso!');

            // Atualiza a lista de grupos localmente sem precisar de F5
            const newChatTeam = { id_user: userId, name: chatName, id_group: groupId, id_priority: priority }; // Assumindo que o backend retorna o id do novo grupo
            // @ts-ignore
            setChats((prevChats) => [...prevChats, newChatTeam]); // Adiciona o novo grupo ao estado de grupos

            setChatName(''); // Limpa o campo
            setChatError(''); // Limpa erros
        } catch (error) {
            setChatError('Erro ao editar chat, tente novamente.');
        }
    }

    async function handleCreateLink() {
        try {
            const response = await createLink({ id_chat: chatId.id, id_user: userId, link: newLink });
            console.log(response);
            fetchLinks();
        } catch (error) {
            console.error('Erro ao criar link:', error);
        }
    }

    async function handleCreateUserChat() {
        const message = await createUserChat({ id_chat: chatId.id, email: newChatUsers });
        
        if (message === 'Usuário adicionado com sucesso!') { 
            setChatUserSucess(message); // Exibe mensagem de sucesso
            fetchChatUsers();
        } else {
            setChatUserError(message); // Exibe mensagem de erro
        }
    }
    


    async function handleDeleteUserChat(id: any) {
            const message = await deleteUserChat({ id_chat: chatId.id, id_user: id });
            if (message === 'Usuário removido com sucesso!') {
                setChatUserSucess(message);
                fetchChatUsers();
            } else {
                setChatUserError(message);
            }
    }


    async function deletarLink(link: any) {
        console.log('Deletando link', link);
        // aqui vai a função para deletar o link

        try {
            const response = await deleteLink({ id_link: link });
            console.log(response);
            setDeleteLinkSucess('Link deletado com sucesso!');

            // Corrigindo a atualização da lista de links
            setLinks(links.filter((item) => item.id !== link));

            console.log(links); // Se quiser ver o estado atualizado, use console.log no callback do setLinks ou após a renderização

        } catch (error) {
            setChatError('Erro ao deletar link, tente novamente.');
        }

    }




    // function pegarDataAtual() {
    //     const dataAtual = new Date();
    //     const dia = (dataAtual.getDate() < 10 ? "0" : "") + dataAtual.getDate();
    //     const mes = ((dataAtual.getMonth() + 1) < 10 ? "0" : "") + (dataAtual.getMonth() + 1);
    //     const ano = dataAtual.getFullYear().toString().slice(-2);  // Apenas os dois últimos dígitos do ano
    //     const hora = (dataAtual.getHours() < 10 ? "0" : "") + dataAtual.getHours();
    //     const minuto = (dataAtual.getMinutes() < 10 ? "0" : "") + dataAtual.getMinutes();

    //     const dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}`;

    //     return dataFormatada;
    // }


    function pegarDataAtual() {
        const dataAtual = new Date();
        const dia = (dataAtual.getUTCDate() < 10 ? "0" : "") + dataAtual.getUTCDate();
        const mes = ((dataAtual.getUTCMonth() + 1) < 10 ? "0" : "") + (dataAtual.getUTCMonth() + 1);
        const ano = dataAtual.getUTCFullYear().toString().slice(-2);  // Apenas os dois últimos dígitos do ano
        const hora = (dataAtual.getUTCHours() < 10 ? "0" : "") + dataAtual.getUTCHours();
        const minuto = (dataAtual.getUTCMinutes() < 10 ? "0" : "") + dataAtual.getUTCMinutes();
    
        const dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    
        return dataFormatada;
    }
    


    const sendMessage = () => {
        if (message) {
            // Verifica se o socket está conectado
            if (socket.connected) {
                const messageData = {
                    authorId: socket.id,
                    author: name,
                    text: message,
                    data: pegarDataAtual(),
                    room: chatName,
                };
                socket.emit('message', messageData);
                setMessage('');
            } else {
                // Exibe uma mensagem de erro ou tenta reconectar
                alert('Conexão perdida. Tentando reconectar...');
                socket.connect(); // Tenta reconectar
            }
        }
    };


    const switchRoom = (newRoom: string) => {
        socket.emit('leave_room', currentRoom.current);
        currentRoom.current = newRoom;
        //sair da sala atual
        console.log('Sala atual: ', currentRoom.current);
        socket.emit('join_room', newRoom);
        setMessages([]);
        socket.emit('get_messages', newRoom);

    };

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

    function setNameChat(name: string) {
        setChatName(name);
        switchRoom(name); // Muda a sala ao mudar o chat
        //captura o id do chat com base no nome
        const chatIdCap = chats.find((chat) => chat.name === name);
        setChatId(chatIdCap);
        //puxa as mensagens antigas
        socket.emit('get_messages', name);

        console.log(chatName);
    }



    return (
        <div>
            <div className='flex items-center gap-4'>
                <ListCollapse size={32} className="block md:hidden text-white p-2 rounded" onClick={toggleTeams} />
                <p className='text-white font-medium text-2xl'>{groupName}</p>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Archive size={20} className="text-white items-center text-center cursor-pointer hover:text-indigo-400" />
                        </TooltipTrigger>
                        <TooltipContent className='border-zinc-700'>
                            <p>Equipes arquivadas</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className='flex flex-row'>
                <div className={`flex flex-col ${isTeamsOpen ? 'block' : 'hidden'} md:block hidden-mobile`}>

                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex flex-row mt-5 cursor-pointer shadow-shape border border-zinc-600 rounded-2xl w-auto min-w-96 items-center hover:bg-indigo-600" onClick={() => setNameChat('Equipe Suporte')}>
                                <div className='w-20 h-20 flex items-center justify-center'>
                                    <Avatar className="w-20 h-20 flex items-center justify-center">
                                        <AvatarFallback className="text-md p-3 rounded-3xl">
                                            <CirclePlus className="cursor-pointer w-12 h-20 ml-3 mr-4 flex items-center justify-center rounded-3xl" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='flex flex-col'>
                                    <p className="text-white text-center flex items-center justify-center text-sm font-semibold">Novo chat</p>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                            <DialogHeader>
                                <DialogTitle>Novo chat</DialogTitle>
                                <DialogDescription className="text-zinc-300">
                                    Crie novos chats para gerenciar suas equipes.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Input para o nome do grupo */}
                                <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm ">
                                    <Users size={24} className="absolute left-3 text-gray-400" />
                                    <Input
                                        name='groupName'
                                        type="text"
                                        value={newChat}
                                        onChange={(e) => setNewChat(e.target.value)} // Captura o nome do novo grupo
                                        placeholder="Nome do chat"
                                        className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape text-white"
                                    />
                                </div>

                                {/* Select para a prioridade com fundo escuro */}
                                <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                                    <MessageCircleWarning size={24} className="absolute left-3 text-gray-400" />
                                    <select
                                        id="priority"
                                        name="priority"
                                        className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-zinc-950 text-white border-none shadow-shape appearance-none"
                                        onChange={(e) => setPriority(e.target.value)} // Captura a prioridade selecionada
                                    >
                                        <option className="bg-zinc-800 text-white" value="">Prioridade</option>
                                        <option className="bg-zinc-800 text-white" value="0">Urgente</option>
                                        <option className="bg-zinc-800 text-white" value="1">Alta</option>
                                        <option className="bg-zinc-800 text-white" value="2">Média</option>
                                        <option className="bg-zinc-800 text-white" value="3">Baixa</option>
                                    </select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600" onClick={handleCreateChat}>Criar novo chat</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* LISTA DE EQUIPES */}
                    {chats.map((chat) => (
                        <div className="flex flex-row mt-5 cursor-pointer shadow-shape bg-zinc-800 rounded-2xl w-auto min-w-96 items-center hover:bg-indigo-500" onClick={() => setNameChat(chat.name)}>
                            <div className='flex flex-col items-center '>
                                <Avatar className="w-20 h-20 flex items-center justify-center">
                                    <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                        {getInitials(chat.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className='flex flex-col'>
                                <p className="text-white text-center flex items-center justify-center text-sm font-semibold">{chat.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`flex flex-col w-full md:ml-10 ${!isTeamsOpen && chatName ? 'block' : 'hidden'}`}>
                    <div className='shadow-shape bg-zinc-800 mt-5 rounded-2xl flex-1 flex flex-col min-h-[600px] md:min-h-[500px] '>
                        <div className="flex flex-row mb-5 cursor-pointer shadow-shape rounded-2xl w-auto min-w-lg items-center min-h-16">
                            <div className='flex flex-col items-center'>
                                <Avatar className="w-10 h-10 md:w-20 md:h-20 max-w-full flex items-center justify-center rounded-3xl">
                                    <AvatarFallback className="bg-zinc-300 text-zinc-950 text-xs md:text-md p-2 md:p-3 rounded-3xl">
                                        {getInitials(chatName)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className='flex flex-row flex-grow items-center justify-between'>
                                <div className='flex h-10 items-center'>
                                    <p className='text-white font-bold md:text-xl text-xs'>{chatName}</p>
                                    <Badge className='bg-red-700 md:ml-5 ml-1'>Alta prioridade</Badge>
                                </div>

                                <div className='md:flex h-10 items-center md:space-x-5 md:mr-5 mr-1 mt-2'>
                                    <Sheet>
                                        <SheetTrigger>
                                            <div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Link2 size={20} className="text-white cursor-pointer hover:text-indigo-400 md:size-6" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className='border-zinc-700 bg-zinc-800'>
                                                            <p>Links importantes</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </SheetTrigger>
                                        <SheetContent className='border border-zinc-700 flex flex-col h-full'>
                                            <div className='flex-grow'>
                                                <SheetHeader>
                                                    <SheetTitle className='mb-3'>Links importantes</SheetTitle>

                                                    {/* O form será empurrado para o rodapé */}
                                                    <div className='flex flex-col items-center justify-center mt-auto'>
                                                        <div className='flex items-center space-x-2'>
                                                            <input
                                                                type='text'
                                                                placeholder='Insira o link aqui...'
                                                                value={newLink}
                                                                onChange={(e) => setNewLink(e.target.value)}
                                                                className='bg-zinc-800 border border-zinc-700 rounded-xl p-3 w-72 h-10 text-white'
                                                            />
                                                            <Button className='p-2 border border-zinc-700 bg-indigo-600 hover:bg-zinc-700' onClick={handleCreateLink}>
                                                                <Plus className='text-white' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <SheetDescription>
                                                        <div className='mt-5'>
                                                            {links.map((link) => (
                                                                <div className='flex items-center justify-between gap-3 mb-1 cursor-pointer hover:text-indigo-400'>
                                                                    <div className='flex items-center gap-3'>
                                                                        <Link2 size={24} className="text-white cursor-pointer" />
                                                                        <p className='font-light text-sm underline'>{link.link}</p>
                                                                    </div>
                                                                    <CircleX size={16} className="text-red-500 cursor-pointer" onClick={() => deletarLink(link.id)} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </SheetDescription>
                                                </SheetHeader>
                                            </div>
                                        </SheetContent>

                                    </Sheet>

                                    <Sheet>
                                        <SheetTrigger>
                                            <div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <UserPlus2 size={20} className="text-white cursor-pointer hover:text-indigo-400  md:size-6" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className='border-zinc-700 bg-zinc-800'>
                                                            <p>Participantes</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </SheetTrigger>
                                        <SheetContent className='border border-zinc-700 '>
                                            <SheetHeader>
                                                <SheetTitle>Participantes</SheetTitle>
                                                <div className='flex flex-col items-center justify-center mt-auto'>
                                                    <div className='flex items-center space-x-2'>
                                                        <input
                                                            type='text'
                                                            placeholder='Adicionar participante... e-mail'
                                                            value={newChatUsers}
                                                            onChange={(e) => setNewChatUsers(e.target.value)}
                                                            className='bg-zinc-800 border border-zinc-700 rounded-xl p-3 w-72 h-10 text-white'
                                                        />
                                                        <Button className='p-2 border border-zinc-700 bg-indigo-600 hover:bg-zinc-700' onClick={handleCreateUserChat}>
                                                            <Plus className='text-white' />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <SheetDescription>
                                                    {chatUsers.map((chatUser) => (
                                                        <div className='flex items-center justify-between gap-3 mb-1 mt-5 cursor-pointer hover:text-indigo-400'>
                                                            <div className='flex items-center gap-3'>
                                                                <Avatar className="w-10 h-10 flex items-center justify-center">
                                                                    <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                                                        {getInitials(chatUser.name)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <p className='font-light text-sm underline'>{chatUser.name}</p>
                                                            </div>

                                                            <CircleX size={16} className="text-red-500 cursor-pointer" onClick={() => handleDeleteUserChat(chatUser.id_user)} />
                                                        </div>
                                                    ))}


                                                </SheetDescription>
                                            </SheetHeader>
                                            <div className="flex items-center justify-center py-2">
                                                {chatUserSucess && (
                                                    <div className="bg-green-500 text-white text-sm font-semibold rounded-md shadow-md p-2 flex items-center">
                                                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {chatUserSucess}
                                                    </div>
                                                )}

                                                {chatUserError && (
                                                    <div className="bg-red-500 text-white text-sm font-semibold rounded-md shadow-md p-2 flex items-center">
                                                        <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        {chatUserError}
                                                    </div>
                                                )}
                                            </div>

                                        </SheetContent>
     
                                    </Sheet>

                                    <Sheet>
                                        <SheetTrigger>
                                            <div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Settings size={20} className="text-white cursor-pointer hover:text-indigo-400  md:size-6" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className='border-zinc-700 bg-zinc-800'>
                                                            <p>Configurações</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </SheetTrigger>
                                        <SheetContent className='border border-zinc-700 '>
                                            <SheetHeader>
                                                <SheetTitle>Configurações</SheetTitle>
                                                <SheetDescription>
                                                    <div className='mt-5'>
                                                        <div className="flex flex-row cursor-pointer w-auto items-center gap-3">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <div className="flex flex-row cursor-pointer w-auto items-center gap-3">
                                                                        <div className='flex flex-col items-center'>
                                                                            <Pencil size={20} className="text-white cursor-pointer hover:text-indigo-400 md:size-6" />
                                                                        </div>
                                                                        <div className='flex flex-col'>
                                                                            <p className="text-white text-center flex items-center justify-center text-sm font-medium">Editar chat</p>
                                                                        </div>
                                                                    </div>

                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Editar chat</DialogTitle>
                                                                        <DialogDescription className="text-zinc-300">
                                                                            Editar chats para gerenciar suas equipes.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="grid gap-4 py-4">

                                                                        <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                                                                            <Users size={24} className="absolute left-3 text-gray-400" />
                                                                            <Input
                                                                                name="groupName"
                                                                                type="text"
                                                                                value={chatName} // Exibe o valor atual do nome do chat
                                                                                onChange={(e) => setChatName(e.target.value)} // Atualiza o nome do chat ao digitar
                                                                                placeholder="Nome do chat"
                                                                                className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape text-white"
                                                                            />
                                                                        </div>

                                                                        <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                                                                            <MessageCircleWarning size={24} className="absolute left-3 text-gray-400" />
                                                                            <select
                                                                                id="priority"
                                                                                name="priority"
                                                                                value={priority} // Exibe a prioridade atual selecionada
                                                                                onChange={(e) => setPriority(e.target.value)} // Atualiza a prioridade ao selecionar
                                                                                className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-zinc-950 text-white border-none shadow-shape appearance-none"
                                                                            >
                                                                                <option className="bg-zinc-800 text-white" value="">Prioridade</option>
                                                                                <option className="bg-zinc-800 text-white" value="1">Alta</option>
                                                                                <option className="bg-zinc-800 text-white" value="2">Média</option>
                                                                                <option className="bg-zinc-800 text-white" value="3">Baixa</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    <DialogFooter>
                                                                        <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600" onClick={handleEditChat}>Editar chat</Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>

                                                        </div>
                                                        <Separator className='bg-zinc-300 mt-5 mb-3' />
                                                        <div className="flex flex-row cursor-pointer w-auto items-center gap-3" onClick={() => setNameChat('Equipe Suporte')}>
                                                            <div className='flex flex-col items-center'>
                                                                <Archive size={20} className="text-white cursor-pointer hover:text-indigo-400 md:size-6" />
                                                            </div>
                                                            <div className='flex flex-col'>
                                                                <p className="text-white text-center flex items-center justify-center text-sm font-medium">Arquivar chat</p>
                                                            </div>
                                                        </div>
                                                        <Separator className='bg-zinc-300 mt-3 mb-3' />
                                                        <div className="flex flex-row cursor-pointer w-auto items-center gap-3 mt-3" onClick={() => setNameChat('Equipe Suporte')}>
                                                            <div className='flex flex-col items-center'>
                                                                <HardDriveDownload size={20} className="text-white cursor-pointer hover:text-indigo-400 md:size-6" />
                                                            </div>
                                                            <div className='flex flex-col'>
                                                                <p className="text-white text-center flex items-center justify-center text-sm font-medium">Dump chat</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SheetDescription>
                                            </SheetHeader>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </div>
                        </div>


                        <div className='flex flex-col flex-1 overflow-auto'>
                            {messages.map((message, index) => (
                                <div
                                    className={`message-container ${message.author === name ? 'justify-end' : 'justify-start'
                                        } flex mb-2 items-center`}
                                    key={index}
                                >
                                    {message.author !== name && (
                                        <Avatar className="w-20 h-20 flex items-center justify-center mr-2 rounded-3xl">
                                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-sm p-3 rounded-3xl">
                                                {getInitials(message.author)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    {/* MENSAGEM */}
                                    <div className={`message ${message.author === name ? 'bg-indigo-700 text-white self-end' : 'bg-zinc-400 text-black'} p-2 rounded-lg max-w-xs flex flex-col ${message.author === name ? 'self-end' : 'self-start'}`}>
                                        <div className="message-author font-bold max-w-xs">{message.author}</div>
                                        <div className="message-text max-w-lg">{message.text}</div>
                                        <div className="message-timestamp text-[10px] text-gray-300 self-end mt-1">{message.data}</div> {/* Alinhado à direita e menor */}
                                    </div>



                                    {message.author === name && (
                                        <Avatar className="w-20 h-20 flex items-center justify-center ml-2 rounded-3xl">
                                            <AvatarFallback className="bg-indigo-300 text-zinc-950 text-sm p-3 rounded-3xl">
                                                {getInitials(message.author)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            ))}

                        </div>

                        <div className="relative flex items-center bg-zinc-900 border-zinc-800 rounded-xl w-full mt-5">
                            <Input
                                type='text'
                                placeholder='Digite uma mensagem...'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                        e.preventDefault();
                                    }
                                }}
                                className="pl-5 pr-4 py-2 text-md rounded-2xl h-12 w-full max-w-4xl border bg-transparent border-none shadow-shape"
                            />
                            <SendHorizonal onClick={sendMessage} size={24} className="absolute right-3 text-indigo-400 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
