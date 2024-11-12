import axios from 'axios';

interface getArchiveChatRequest {
    id_group: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getArchiveChats({ id_group }: getArchiveChatRequest) {
    const response = await axios.get(`${API_BASE_URL}/chats-archive/${id_group}`); 

    if (response.status === 201) {
        return 'Chat arquivado com sucesso!';
    } else {
        return 'Não foi possível arquivar o chat. Tente novamente!';
    }
}