import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
// @ts-ignore
import { AtSign, CirclePlus, Mail, MessageCircleCode, User, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAccount } from "@/http/get-account";
import { editAccount } from "@/http/edit-account";
import { uploadPhoto } from "@/http/upload-photo";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
// @ts-ignore
import { set } from "react-hook-form";

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
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    
    const fetchAccount = async () => {
        const response = await getAccount({ email });
        setUsername(response.name);
        setUserEmail(response.email);
        setUserId(response.id);
        setUserLink(response.link_profile);
        setUserStatus(response.status);
        const base64String = `data:image/jpeg;base64,${Buffer.from(response.photo.data).toString('base64')}`;
        setPhoto(base64String); 
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
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Verifica se existe um arquivo
        if (file) {
            // @ts-ignore
            setPhoto(file); // Atualiza o estado com o objeto File diretamente
        }
    };
    
    const handleSavePhoto = async () => {
        if (!photo) {
            alert("Por favor, selecione uma foto.");
            return;
        }
    
        try {
            // Aqui passamos o file diretamente para a função que faz a requisição
            // @ts-ignore
            const response = await uploadPhoto({ photo: photo, id_user: userId });
            toast.success(response);
        } catch (error) {
            console.error("Erro ao enviar foto:", error);
            toast.error("Erro ao enviar foto. Tente novamente!");
        }
    };
    

    
    
    useEffect(() => {
        fetchAccount();
        setPhotoUrl(localStorage.getItem('photo'));

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
        <div>
            <ToastContainer />
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
                                {photoUrl ? (
                                    // Verifica se é uma string ou um File
                                    <img src={photoUrl} alt="Foto de perfil" />
                                ) : (
                                    // Se não houver foto, exibe o fallback com as iniciais
                                    <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                        {getInitials(name)}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-1 text-white bg-black hover:bg-indigo-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit className="w-4 h-4" />
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
                                <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                                <input
                                    type="file"
                                    onChange={handlePhotoUpload} // Captura o arquivo selecionado
                                    className="pl-1 pr-4 py-2 text-md rounded-2xl bg-transparent border-none shadow-shape"
                                    name = "photo"
                                />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                id = 'alterar_foto'
                                type="button" // Define o botão como "button" para evitar submissão automática
                                className="border border-zinc-600 hover:bg-indigo-600"
                                onClick={handleSavePhoto} // Chama a função para salvar a foto quando o botão for clicado
                                >
                                Alterar foto
                                </Button>
                            </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                        <Mail size={24} className="absolute left-3 text-gray-400" />
                        <Input 
                            id="email"
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
                            id="name"
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
                            id = 'link'
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
                            id="status"
                            name='status'
                            type="status" 
                            placeholder="Status"  
                            value={userStatus}
                            onChange={handleChangeStatus}
                            className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                        />
                    </div>

                    <Button
                        id='edit-account'
                        type="submit"
                        className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-10 hover:bg-indigo-500 shadow-shape"
                    >
                        Salvar
                    </Button>
                </form>
            </div>
        </div>
    );
}
