import axios, { AxiosError } from 'axios';

interface deleteUserChatRequest {
    id_chat: string;
    id_user: string;
    }


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function deleteUserChat({ id_chat, id_user }: deleteUserChatRequest) {
    try {
        const response = await axios.post(`${API_BASE_URL}/chatsuser/${id_chat}/${id_user}`); // Usa a URL base da API
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data || 'Erro ao conectar com o servidor';
        }
        return 'Erro desconhecido';
    }
}

