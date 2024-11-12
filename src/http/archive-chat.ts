import axios from 'axios';

interface archiveChatRequest {
    id_chat: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function archiveChat({ id_chat }: archiveChatRequest) {
    const response = await axios.post(`${API_BASE_URL}/chats/archive/${id_chat}`); // Usa a URL base da API

    if (response.status === 201) {
        return 'Chat arquivado com sucesso!';
    } else {
        return 'Não foi possível arquivar o chat. Tente novamente!';
    }
}