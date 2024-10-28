import axios, { AxiosError } from 'axios';


interface createChatRequest {
    id_user: string | null;
    name: string | null;
    id_group: string | null;
    id_priority: string | null;
}

interface createUserChatRequest {
    id_chat: string | null;
    email: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createChat({ id_user, name, id_group, id_priority  }: createChatRequest) { // Função para criar uma conta
    const response = await axios.post(`${API_BASE_URL}/chats`, { id_user, name, id_group, id_priority }); // Usa a URL base da API

    if (response.status === 200) { // Verifica se a resposta foi bem-sucedida
        return 'Chat criado com sucesso!'; // Retorna uma mensagem de sucesso
    } else {
        return 'Não foi possível criar o chat. Tente novamente!'; // Retorna uma mensagem de erro
    }
}


export async function createUserChat({ id_chat, email }: createUserChatRequest) { 
    try {
        const response = await axios.post(`${API_BASE_URL}/chats/users`, { id_chat, email });
        return response.data; 
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || 'Erro ao conectar com o servidor';
        }
        return 'Erro desconhecido';
    }
}


