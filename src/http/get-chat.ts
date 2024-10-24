import axios from 'axios';

interface getChatsRequest {
    id_group: string | null;
    id_user: string | null;
}

interface getUserChatsRequest {
    id_chat: string;
}

interface Chat {
    id: string;
    id_user: string;
    name: string;
    id_priority: string;
    id_group: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getChats({ id_group, id_user }: getChatsRequest): Promise<Chat[]> {
    try {
        // Fazendo a requisição para buscar perfis de acordo com o ID do usuário
        const response = await axios.get(`${API_BASE_URL}/chats/${id_group}/${id_user}`);
        
        // Retorna os perfis formatados conforme a resposta da API
        const data: Chat[] = response.data.map((chats: any) => ({
            id: chats.id,
            name: chats.name,  
        }));

        return data;

    } catch (error) {
        console.error('Erro ao buscar chats:', error);
        throw new Error('Não foi possível buscar os chats');
    }
}


//buscar participantes do chat
export async function getUserChats({ id_chat }: getUserChatsRequest): Promise<Chat[]> {
    try {
        // Fazendo a requisição para buscar perfis de acordo com o ID do usuário
        const response = await axios.get(`${API_BASE_URL}/chats/users/${id_chat}`);
        
        // Retorna os perfis formatados conforme a resposta da API
        const data: Chat[] = response.data.map((chats: any) => ({
            id: chats.id,
            name: chats.name,  
        }));

        return data;

    } catch (error) {
        console.error('Erro ao buscar chats:', error);
        throw new Error('Não foi possível buscar os chats');
    }
}