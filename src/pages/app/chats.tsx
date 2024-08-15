import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/authProvider';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Archive, CirclePlus, Link2, ListCollapse, SendHorizonal, Settings, UserPlus2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
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
  

const socket = io('http://localhost:3001'); 
interface Message {
    authorId: string;
    author: string;
    text: string;
  }

export function Chat() {
    const [messages, setMessages] =useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [isTeamsOpen, setIsTeamsOpen] = useState(false);
    const [chatName, setChatName] = useState('Chat Geral');
    const { name } = useAuth();

    const toggleTeams = () => setIsTeamsOpen(prev => !prev);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.on('connect', () => {
            console.log('Conectado ao WebSocket');
        });

        socket.on('received_message', (data) => {
            setMessages((prevMessages) => {
                return [...prevMessages, data];
            });
        });
          
        socket.emit('set_username', name); 

        return () => {
            socket.disconnect();
        }
    }, [name]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (message) {
            socket.emit('message', message);
            setMessage('');
        }
    };

    const getInitials = (name: string) => {
        if (!name || typeof name !== 'string') {
            return '';
        }
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    function setNameChat(name: string) {
        setChatName(name);
        console.log(chatName);
    }
    
    return (
        <div>
            <div className='flex items-center gap-4'>
                <ListCollapse size={32} className="block md:hidden text-white p-2 rounded" onClick={toggleTeams} />
                <p className='text-white font-medium text-2xl'>Cliente X</p>
                <Badge className='bg-red-700'>Alta prioridade</Badge>
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
                    <div className="flex flex-row mt-5 cursor-pointer shadow-shape bg-zinc-700 rounded-2xl w-auto min-w-96 items-center hover:bg-indigo-500" onClick={() => setNameChat('Equipe Desenvolvimento')}>
                        <div className='flex flex-col items-center '>
                        <Avatar className="w-20 h-20 flex items-center justify-center">
                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                {getInitials('Equipe Desenvolvimento')}
                            </AvatarFallback>
                        </Avatar>
                        </div>
                        <div className='flex flex-col'>
                        <p className="text-white text-center flex items-center justify-center text-sm font-semibold">Equipe Desenvolvimento</p>
                        </div>
                    </div>
                    <div className="flex flex-row mt-5 cursor-pointer shadow-shape bg-zinc-700 rounded-2xl w-auto min-w-96 items-center hover:bg-indigo-500" onClick={() => setNameChat('Equipe Suporte')}>
                        <div className='flex flex-col items-center '>
                        <Avatar className="w-20 h-20 flex items-center justify-center rounded-3xl">
                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                {getInitials('Equipe Suporte')}
                            </AvatarFallback>
                        </Avatar>
                        </div>
                        <div className='flex flex-col'>
                            <p className="text-white text-center flex items-center justify-center text-sm font-semibold">Equipe Suporte Técnico</p>
                        </div>
                    </div>
                    <div className="flex flex-row mt-5 cursor-pointer shadow-shape border border-zinc-600 rounded-2xl w-auto min-w-96 items-center hover:bg-zinc-800" onClick={() => setNameChat('Equipe Suporte')}>
                        <div className='flex flex-col items-center '>
                            <CirclePlus className="cursor-pointer w-12 h-20 ml-3 mr-4 flex items-center justify-center rounded-3xl" />
                        </div>
                        <div className='flex flex-col'>
                            <p className="text-white text-center flex items-center justify-center text-sm font-semibold">Novo grupo</p>
                        </div>
                    </div>
                </div>

                <div className={`flex flex-col w-full md:ml-10 ${!isTeamsOpen ? 'block' : 'hidden'}`}>
                    <div className='shadow-shape bg-zinc-800 mt-5 rounded-2xl flex-1 flex flex-col max-h-[700px] md:min-h-[600px] '>
                        <div className="flex flex-row mb-5 cursor-pointer shadow-shape rounded-2xl w-auto min-w-96 items-center h-16">
                            <div className='flex flex-col items-center'>
                                <Avatar className="w-20 max-20 flex items-center justify-center rounded-3xl">
                                    <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                        {getInitials(chatName)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className='flex flex-row flex-grow items-center justify-between'>
                                <div className='flex h-10 items-center'>
                                    <p className='text-white font-bold text-xl'>{chatName}</p>
                                    <Badge className='bg-red-700 ml-5'>Alta prioridade</Badge>
                                </div>

                                <div className='flex h-10 items-center space-x-5 mr-5'>
                                    <Sheet>
                                        <SheetTrigger>
                                            <div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Link2 size={24} className="text-white cursor-pointer hover:text-indigo-400" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className='border-zinc-700 bg-zinc-800'>
                                                            <p>Links importantes</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>  
                                            </div>
                                        </SheetTrigger>
                                        <SheetContent className='border border-zinc-700 '>
                                            <SheetHeader>
                                            <SheetTitle>Links importantes</SheetTitle>
                                            <SheetDescription>   
                                                <div className='mt-5 '>
                                                    <div className='flex flex-1 gap-3 mb-1 cursor-pointer hover:text-indigo-400'>
                                                        <Link2 size={24} className="text-white cursor-pointer" />
                                                        <p className='font-light text-sm underline'>www.google.com</p>
                                                    </div>
                                                    <div className='flex flex-1 gap-3 mb-1 cursor-pointer hover:text-indigo-400'>
                                                    <Link2 size={24} className="text-white cursor-pointer" />
                                                    <p className='font-light text-sm underline'>www.ienh.com.br</p>
                                                </div>
                                                </div>
                                               
                                            </SheetDescription>
                                            </SheetHeader>
                                        </SheetContent>
                                    </Sheet>

                                    <Sheet>
                                        <SheetTrigger>
                                            <div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <UserPlus2 size={24} className="text-white cursor-pointer hover:text-indigo-400" />
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
                                            <SheetDescription>   
                                                <div className='mt-5'>
                                                    <div className="flex flex-row cursor-pointer w-auto items-center" onClick={() => setNameChat('Equipe Suporte')}>
                                                        <div className='flex flex-col items-center '>
                                                        <Avatar className="w-20 h-20 flex items-center justify-center rounded-3xl">
                                                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                                                {getInitials('Eduarda Dalmas')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <p className="text-white text-center flex items-center justify-center text-sm font-normal">Eduarda Dalmas</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row cursor-pointer w-auto items-center" onClick={() => setNameChat('Equipe Suporte')}>
                                                        <div className='flex flex-col items-center'>
                                                            <Avatar className="w-20 h-20 flex items-center justify-center">
                                                                <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                                                    {getInitials('Adrielly Souza')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <p className="text-white text-center flex items-center justify-center text-sm font-normal">Adrielly Souza</p>
                                                        </div>
                                                    </div>
                                                </div>
                                               
                                            </SheetDescription>
                                            </SheetHeader>
                                        </SheetContent>
                                    </Sheet>

                                    <Sheet>
                                        <SheetTrigger>
                                            <div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Settings size={24} className="text-white cursor-pointer hover:text-indigo-400" />
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
                            className={`message-container ${
                                message.authorId === socket.id ? 'justify-end' : 'justify-start'
                            } flex mb-2 items-center`}
                            key={index}
                            >
                            {message.authorId !== socket.id && (
                                <Avatar className="w-20 h-20 flex items-center justify-center mr-2 rounded-3xl">
                                <AvatarFallback className="bg-zinc-300 text-zinc-950 text-sm p-3 rounded-3xl">
                                    {getInitials(message.author)}
                                </AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`message ${message.authorId === socket.id ? 'bg-indigo-700 text-white' : 'bg-zinc-400 text-black'} p-2 rounded-lg max-w-xs `}>
                                <div className="message-author font-bold max-w-xs">{message.author}</div>
                                <div className="message-text max-w-lg">{message.text}</div>
                            </div>
                            {message.authorId === socket.id && (
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
