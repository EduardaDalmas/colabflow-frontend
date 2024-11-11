import axios from 'axios';

interface dumpChatRequest {
    id_chat: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function dumpChat({ id_chat }: dumpChatRequest): Promise<void> {
    try {

        console.log('id_chat', id_chat);
        const response = await axios.get(`${API_BASE_URL}/chats-dump/${id_chat}}`, {

            responseType: 'blob', // Define o tipo de resposta como blob
        });

            // Cria uma URL temporária para o arquivo e inicia o download
            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `dump_chat_${id_chat}.sql`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            // Libera o URL temporário
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao fazer o dump do chat:', error);
            throw new Error('Não foi possível fazer o dump do chat');
        }



    }