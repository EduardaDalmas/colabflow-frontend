import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
// @ts-ignore
import { AtSign, CirclePlus, Mail, MessageCircleCode, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAccount } from "@/http/get-account";
import { editAccount } from "@/http/edit-account";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Função para obter iniciais do nome
function getInitials(fullName: string) {
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

export function Account() {
    const [username, setUsername] = useState('');
    const [useremail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [userLink, setUserLink] = useState('');
    const [userStatus, setUserStatus] = useState('');
    // @ts-ignore
    const navigate = useNavigate();
    const { name, email } = useAuth();
    const [accountError, setAccountError] = useState('');
    const [accountSuccess, setAccountSuccess] = useState('');

    const fetchAccount = async () => {
        const response = await getAccount({ email });
        setUsername(response.name);
        setUserEmail(response.email);
        setUserId(response.id);
        setUserLink(response.link_profile);
        setUserStatus(response.status);
    }

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
    }, []);

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
            <h1 className="text-2xl font-medium text-white mb-10">Meus dados</h1>
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
                    <Dialog>
                    <DialogTrigger asChild>
                        <div className="relative group">
                            <Avatar className="w-20 h-20 cursor-pointer">
                                <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                    {getInitials(name)}
                                </AvatarFallback>
                            </Avatar>
                            {/* Texto de hover */}
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-1 text-sm text-white bg-black rounded px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                Alterar foto
                            </span>
                        </div>
                    </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                            <DialogHeader>
                                <DialogTitle>Nova foto de perfil</DialogTitle>
                                <DialogDescription className="text-zinc-300">
                                    Selecione uma imagem para o perfil
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm ">
                                    <input type="file" className="pl-1 pr-4 py-2 text-md rounded-2xl   border bg-transparent border-none shadow-shape" />
                                </div>
                            </div>
                            <DialogFooter>
                            <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600" >Alterar foto</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <Mail size={24} className="absolute left-3 text-gray-400" />
                    <Input 
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
                        name='link'
                        type="link" 
                        placeholder="Link profile"  
                        value={userLink}
                        onChange={handleChangeLink}
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <MessageCircleCode size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        name='status'
                        type="status" 
                        placeholder="Status"  
                        value={userStatus}
                        onChange={handleChangeStatus}
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <Button
                    type="submit"
                    className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-10 hover:bg-indigo-500 shadow-shape"
                >
                    Salvar
                </Button>
            </form>
        </div>
    );
}
