import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProfiles } from '@/http/get-profiles';
import { createProfile } from '@/http/create-profile';
import { CirclePlus, Users } from 'lucide-react';
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
            return;
        }

        try {
            const response = await createProfile({ description: newProfileName, id_user: userId }); // Cria o perfil no backend
            setProfileSucess('Perfil criado com sucesso!');

            // Atualiza a lista de perfis localmente sem precisar de F5
            // @ts-ignore
            const newProfile = { id: response.id, name: newProfileName }; // Assumindo que o backend retorna o id do novo perfil
            setProfiles((prevProfiles) => [...prevProfiles, newProfile]); // Adiciona o novo perfil ao estado de perfis

            setNewProfileName(''); // Limpa o campo
            setProfileError(''); // Limpa erros
        } catch (error) {
            setProfileError('Erro ao criar perfil, tente novamente.');
        }
    }

    const navigate = useNavigate();

    function openHomeProfile(id: string) {
        // Passa o id do profile como parte da URL
        navigate(`/home/${id}`);
    }

    return (
        <div className="flex flex-col items-center justify-center">

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
                    <div key={profile.id} className="mb-4 p-5 cursor-pointer" onClick={() => openHomeProfile(profile.id)}>
                        <Avatar className="w-20 h-20">
                            <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                                {getInitials(profile.name)}
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-white text-center text-xs mt-2 max-w-20">{profile.name}</p>
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
