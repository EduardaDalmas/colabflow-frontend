import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { profile } from 'console';
import { SendHorizonal } from 'lucide-react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); 

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(''); 

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado ao WebSocket');
    });

    // Receber mensagens do servidor
    socket.on('received_message', (data) => {
      setMessages((prevMessages) => {
        return [...prevMessages, data];
      });
    });

    // Desconectar do WebSocket
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('message', message);
      setMessage(''); // Limpar o campo de mensagem após o envio
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    socket.emit('set_username', e.target.value); // Enviar o nome de usuário para o servidor
  };

  return (
    <div className='h-screen w-full'>
        <div className='flex items-start'>
            <p className='text-white font-medium text-2xl'>Equipes</p>
        </div>
        <div className='flex flex-row'>
            <div className='flex flex-col'>
                <div className="flex flex-row mt-5 cursor-pointer shadow-shape bg-zinc-700 rounded-2xl w-auto min-w-96 items-center hover:bg-indigo-500">
                    <div className='flex flex-col items-center '>
                        <Avatar className="w-20 h-20 flex items-center justify-center">
                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                ED
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex flex-col'>
                        <p className="text-white text-center flex items-center justify-center text-sm font-semibold">Equipe Desenvolvimento</p>
                    </div>
                </div>
                <div className="flex flex-row mt-5 cursor-pointer shadow-shape bg-zinc-700 rounded-2xl w-auto min-w-96 items-center hover:bg-indigo-500">
                    <div className='flex flex-col items-center '>
                        <Avatar className="w-20 h-20 flex items-center justify-center rounded-3xl">
                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                ES
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex flex-col'>
                        <p className="text-white text-center flex items-center justify-center text-sm font-semibold">Equipe Suporte Tecnico</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col max-h-96 w-full  ml-10'>
                <div className='shadow-shape bg-zinc-800 mt-5 rounded-2xl items-center'>
                    <div className="flex flex-row mb-5 cursor-pointer shadow-shape rounded-2xl w-auto min-w-96 items-center">
                    <div className='flex flex-col items-center '>
                        <Avatar className="w-20 h-20 flex items-center justify-center rounded-3xl">
                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-md p-3 rounded-3xl">
                                ES
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-white font-bold text-xl'>Equipe desenvolvimento</p>
                    </div>
                </div>
                   
                   
                    <div className='flex flex-col'>
                        {messages.map((message, index) => (
                            <div
                            className={`message-container ${
                                message.authorId === socket.id ? 'justify-end' : 'justify-start'
                            } flex mb-2`}
                            key={index}
                            >
                            <div className={`message ${message.authorId === socket.id ? 'bg-indigo-700 text-white' : 'bg-zinc-400 text-black'} p-2 rounded-lg max-w-xs mr-1 ml-1`}>
                                <div className="message-author font-bold">{message.author}</div>
                                <div className="message-text">{message.text}</div>
                            </div>
                            </div>
                        ))}
                        </div>
                    <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl w-full mt-5">
                   
                        <Input 
                            type='text'
                            placeholder='Digite uma mensagem...'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="pl-5 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                        />
                        <SendHorizonal onClick={sendMessage} size={24} className="absolute right-3 text-gray-400 cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}