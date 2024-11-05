import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// @ts-ignore
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
// @ts-ignore
import { AtSign, CirclePlus, Mail, MessageCircleCode, User } from "lucide-react";
// @ts-ignore
import { useNavigate, useParams } from "react-router-dom";
import { getAccountId } from "@/http/get-account-id";
import { editAccount } from "@/http/edit-account";
import { useEffect, useState } from "react";
// @ts-ignore
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// @ts-ignore
import { useLocation } from 'react-router-dom';

// Função para obter iniciais do nome
function getInitials(fullName: string) {
    if(fullName) {
        const nameParts = fullName.split(' ');
        if (nameParts.length >= 2) {
            const firstInitial = nameParts[0].charAt(0);
            const lastInitial = nameParts[nameParts.length - 1].charAt(0);
            return firstInitial + lastInitial;
        }
        const words = fullName.split(' ');
        if (words.length === 0) {
            return '';
        }

        const firstInitial = words[0][0];
        const lastInitial = words[words.length - 1][0];

        return (firstInitial + lastInitial).toUpperCase();
    }
}

export function PublicAccount() {
    const [username, setUsername] = useState('');
    const [useremail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [userLink, setUserLink] = useState('');
    const [userStatus, setUserStatus] = useState('');
    const { id } = useParams(); // Captura o ID da URL
    // @ts-ignore
    const { name, email } = useAuth();
    const [accountError, setAccountError] = useState('');
    const [accountSuccess, setAccountSuccess] = useState('');

    const fetchAccount = async () => {
        try {
            // @ts-ignore
            const response = await getAccountId({ id }); // Passa o ID para buscar os dados da conta
            setUsername(response.name);
            setUserEmail(response.email);
            setUserId(response.id);
            setUserLink(response.link_profile);
            setUserStatus(response.status);
        } catch (error) {
            console.error('Erro ao buscar dados da conta:', error);
            setAccountError('Erro ao buscar dados da conta');
            setTimeout(() => {
                setAccountError('');
            }, 3000); // 3 segundos
        }
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
    
        try {
            const response = await editAccount({ email: useremail, name: username, link_profile: userLink, status: userStatus, id: userId });
            if (response && response.status === 200) {
                setAccountSuccess('Conta editada com sucesso');
                setTimeout(() => {
                    setAccountSuccess('');
                }, 3000); // 3 segundos
            } else {
                setAccountError('Erro ao editar a conta');
                setTimeout(() => {
                    setAccountError('');
                }, 3000); // 3 segundos
            }
        } catch (error) {
            setAccountError('Erro ao editar a conta');
            console.error('Erro ao editar a conta:', error);
            setTimeout(() => {
                setAccountError('');
            }, 3000); // 3 segundos
        }
    }
    
    useEffect(() => {
        fetchAccount();
    }, [id]); // Adiciona id como dependência para refetch quando id mudar

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleChangeMail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value);
    }

    const handleChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserLink(e.target.value);
    }

    const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserStatus(e.target.value);
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center py-4">
                {accountSuccess && (
                    <div className="bg-green-500 text-white text-lg font-semibold rounded-md shadow-lg p-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {accountSuccess}
                    </div>
                )}

                {accountError && (
                    <div className="bg-red-500 text-white text-lg font-semibold rounded-md shadow-lg p-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {accountError}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col border border-zinc-800 p-10 items-center rounded-2xl shadow-shape justify-center'>
                <div className="flex flex-row items-center mb-4 p-5">
                    <div className="relative group">
                        <Avatar className="w-20 h-20 cursor-pointer">
                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                {getInitials(username)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <Mail size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        disabled
                        name='email'
                        type="email" 
                        placeholder="Email"  
                        value={useremail}
                        onChange={handleChangeMail}
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <User size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        disabled
                        name='name'
                        type="name" 
                        placeholder="Nome"  
                        value={username}
                        onChange={handleChangeName}
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <AtSign size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        disabled
                        name='link'
                        type="url" 
                        placeholder="Link de perfil"  
                        value={userLink}
                        onChange={handleChangeLink}
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <MessageCircleCode size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        disabled
                        name='status'
                        type="text" 
                        placeholder="Status"  
                        value={userStatus}
                        onChange={handleChangeStatus}
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

            </form>
        </div>
    );
}
