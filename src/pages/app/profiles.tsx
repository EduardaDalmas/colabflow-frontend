import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProfiles } from '@/http/get-profiles';
import { editProfile } from '@/http/edit-profile';
import { deleteProfile } from '@/http/delete-profile';
import { createProfile } from '@/http/create-profile';
import { CirclePlus, Edit, Trash2, Users } from 'lucide-react';
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Profile {
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


export function SetProfile() {
    // Inicialize o estado com o tipo correto
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [newProfileName, setNewProfileName] = useState(''); // Estado para o novo perfil
    const [profileError, setProfileError] = useState('');
    const [profileSucess, setProfileSucess] = useState('');
    // @ts-ignore
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('user_id')); // Obtém o ID do usuário do localStorage


    // Função para buscar perfis
    async function fetchProfiles() {
        try {
            const data = await getProfiles({ id_user: userId });
            setProfiles(data); // Atualiza os perfis com o retorno da API
        } catch (error) {
            console.error('Erro ao buscar perfis:', error);
        }
    }

    // Função para editar o nome do perfil
    function handleEditProfileName(id: string, name: string) {
        console.log('Editando perfil:', id, name);
        setProfiles((prevProfiles) => {
            return prevProfiles.map((profile) => {
                if (profile.id === id) {
                    return { ...profile, name };
                }
                return profile;
            });
        });
    }

    // Função para salvar o perfil
    async function handleSaveProfile(id: string) {
        console.log('Salvando perfil:', id);
        try {
            const profile = profiles.find((profile) => profile.id === id);
            if (!profile) {
                console.error('Perfil não encontrado:', id);
                return;
            }

            // Atualiza o perfil no backend
            await editProfile({ id: profile.id, description: profile.name, id_user: userId });
            toast.success("Perfil salvo com sucesso!");
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            toast.error("Erro ao salvar perfil!");
        }
    }
    
    // Função para deletar o perfil
    async function handleDeleteProfile(id: string) {
        try {
            // Atualiza a lista de perfis localmente sem precisar de F5
            setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== id));
            await deleteProfile({ id }); // Deleta o perfil no backend
            toast.success("Perfil deletado com sucesso!");
        } catch (error) {
            console.error('Erro ao deletar perfil:', error);
            toast.error("Erro ao deletar perfil!");
        }
    }

    // Função para fechar o modal
    function closeDialog() {
        // @ts-ignore
        document.querySelector('dialog').close();
    }


    // Observa mudanças no ID do usuário
    useEffect(() => {
        if (userId) {
            fetchProfiles();
        } else {
            setProfiles([]); // Se o usuário não estiver logado, zera os perfis
        }
    }, [userId]); // Reexecuta sempre que userId mudar

    async function handleCreateProfile() {
        if (newProfileName.trim() === '') {
            setProfileError('Nome do perfil não pode estar vazio.');
            setTimeout(() => {
                setProfileError('');
            }, 3000); // 3 segundos
            return;
        }

        try {
            const response = await createProfile({ description: newProfileName, id_user: userId }); // Cria o perfil no backend
            setProfileSucess('Perfil criado com sucesso!');
            setTimeout(() => {
                setProfileSucess('');
            }, 3000); // 3 segundos

            // Atualiza a lista de perfis localmente sem precisar de F5
            // @ts-ignore
            const newProfile = { id: response.id, name: newProfileName }; // Assumindo que o backend retorna o id do novo perfil
            setProfiles((prevProfiles) => [...prevProfiles, newProfile]); // Adiciona o novo perfil ao estado de perfis

            setNewProfileName(''); // Limpa o campo
        } catch (error) {
            setProfileError('Erro ao criar perfil, tente novamente.');
            setTimeout(() => {
                setProfileError('');
            }, 3000); // 3 segundos
        }
    }

    const navigate = useNavigate();

    function openHomeProfile(id: string) {
        // Passa o id do profile como parte da URL
        navigate(`/home/${id}`);
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <ToastContainer />

            <div className="flex items-center justify-center py-4">
                {profileSucess && (
                    <div className="bg-green-500 text-white text-lg font-semibold rounded-md shadow-lg p-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {profileSucess}
                    </div>
                )}

                {profileError && (
                    <div className="bg-red-500 text-white text-lg font-semibold rounded-md shadow-lg p-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {profileError}
                    </div>
                )}
            </div>



            <h1 className="text-2xl font-medium text-white mb-10">
                Selecione o perfil (contexto)
            </h1>

            <div className="flex flex-row items-center">
                {profiles.map(profile => (
                    <div
                        key={profile.id}
                        className="mb-4 p-5 cursor-pointer relative group"
                    >
                        <Avatar className="w-20 h-20">
                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500" onClick={() => openHomeProfile(profile.id)}>
                                {getInitials(profile.name)}
                            </AvatarFallback>
                        </Avatar>

                        <p className="text-white text-center text-xs mt-2 max-w-20">{profile.name}</p>

                        <div className="absolute -top-2 -right-2 p-2 bg-gray-800 rounded-full flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="text-white hover:text-indigo-400" onClick={(e) => e.stopPropagation()}>
                                    <Edit size={16} />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                                <DialogHeader>
                                    <DialogTitle>Editar perfil</DialogTitle>
                                    <DialogDescription className="text-zinc-300">
                                        Edite as informações do perfil.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                                        <Users size={24} className="absolute left-3 text-gray-400" />
                                        <Input
                                            name='profileName'
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => handleEditProfileName(profile.id, e.target.value)}
                                            placeholder="Nome do perfil"
                                            className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600" onClick={() => handleSaveProfile(profile.id)}>
                                        Salvar alterações
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="text-white hover:text-red-400" onClick={(e) => e.stopPropagation()}>
                                    <Trash2 size={16} />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 shadow-shape">
                                <DialogHeader>
                                    <DialogTitle>Confirmar exclusão</DialogTitle>
                                    <DialogDescription className="text-zinc-300">
                                        Tem certeza de que deseja excluir o perfil "{profile.name}"? Esta ação não pode ser desfeita.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" className="border border-zinc-600 hover:bg-gray-700" onClick={() => closeDialog()}>
                                        Cancelar
                                    </Button>
                                    <Button className="border border-zinc-600 hover:bg-red-600" onClick={() => handleDeleteProfile(profile.id)}>
                                        Excluir
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
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
                                <DialogTitle>Novo perfil</DialogTitle>
                                <DialogDescription className="text-zinc-300">
                                    Crie novos perfis para gerenciar seus grupos.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm ">
                                    <Users size={24} className="absolute left-3 text-gray-400" />
                                    <Input
                                        name='profileName'
                                        type="profileName"
                                        value={newProfileName}
                                        onChange={(e) => setNewProfileName(e.target.value)} // Captura o nome do novo perfil
                                        placeholder="Nome do perfil"
                                        className="pl-12 pr-5 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="border border-zinc-600 hover:bg-indigo-600" onClick={handleCreateProfile}>Criar novo perfil</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
