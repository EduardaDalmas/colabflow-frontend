import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Archive, CirclePlus, HardDriveDownload, Info, Link2, ListCollapse, SendHorizonal, Settings, UserPlus2 } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
  

const socket = io('http://localhost:3001'); 
interface Message {
    authorId: string;
    author: string;
    text: string;
    data: string;
    hora: string;
  }

export function Chat() {
    const [messages, setMessages] =useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [isTeamsOpen, setIsTeamsOpen] = useState(false);
    const [chatName, setChatName] = useState('');
    const { name } = useAuth();
    const currentRoom = useRef(chatName); // Guarda a sala atual
    


    const toggleTeams = () => setIsTeamsOpen(prev => !prev);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.on('connect', () => {
            console.log('Conectado ao WebSocket');
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
        
          
        socket.emit('set_username', name); 

        return () => {
            socket.disconnect();
        }
    }, [name]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function pegarDataAtual(){
    var dataAtual = new Date();
    var dia = (dataAtual.getDate()<10 ? "0" : "") + dataAtual.getDate();
    var mes = ((dataAtual.getMonth() + 1)<10 ? "0" : "") + (dataAtual.getMonth() + 1);
    var ano = dataAtual.getFullYear();
    var hora = (dataAtual.getHours()<10 ? "0" : "") + dataAtual.getHours();
    var minuto = (dataAtual.getMinutes()<10 ? "0" : "") + dataAtual.getMinutes();
    var segundo = (dataAtual.getSeconds()<10 ? "0" : "") + dataAtual.getSeconds();

    var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
    //define data e hora da mensagem
    


    return dataFormatada;
    }

    const sendMessage = () => {
        if (message) {
            //envia mensagem com a data
            const messagemData = {
                authorId: socket.id,
                author: name,
                text: message,
                data: pegarDataAtual(),
                room: chatName,
            };
            socket.emit('message', messagemData);
            setMessage('');
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
        switchRoom(name); // Muda a sala ao mudar o chat
        //puxa as mensagens antigas
        socket.emit('get_messages', name);
        
        console.log(chatName);
    }
    
    return (
        <div>
            <div className='flex items-center gap-4'>
                <ListCollapse size={32} className="block md:hidden text-white p-2 rounded" onClick={toggleTeams} />
                <p className='text-white font-medium text-2xl'>Cliente X</p>
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
                                                    <div className="flex flex-row cursor-pointer w-auto items-center gap-3" onClick={() => setNameChat('Equipe Suporte')}>
                                                        <div className='flex flex-col items-center'>
                                                            <Info size={20} className="text-white cursor-pointer hover:text-indigo-400  md:size-6" />
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <p className="text-white text-center flex items-center justify-center text-sm font-medium">Prioridade</p>
                                                        </div>
                                                    </div>
                                                    <Separator className='bg-zinc-300 mt-3 mb-3'/>
                                                    <div className="flex flex-row cursor-pointer w-auto items-center gap-3" onClick={() => setNameChat('Equipe Suporte')}>
                                                        <div className='flex flex-col items-center'>
                                                            <Archive size={20} className="text-white cursor-pointer hover:text-indigo-400 md:size-6" />
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <p className="text-white text-center flex items-center justify-center text-sm font-medium">Arquivar chat</p>
                                                        </div>
                                                    </div>
                                                    <Separator className='bg-zinc-300 mt-3 mb-3'/>
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

                            {/* MENSAGEM */}
                            <div className={`message ${message.authorId === socket.id ? 'bg-indigo-700 text-white' : 'bg-zinc-400 text-black'} p-2 rounded-lg max-w-xs `}>
                                <div className="message-author font-bold max-w-xs">{message.author}</div>
                                <div className="message-text max-w-lg">{message.text}</div>{/* Exibe a mensagem */}
                                <div className="message-timestamp text-xs text-white">{message.data}</div> {/* Exibe a data */}

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
