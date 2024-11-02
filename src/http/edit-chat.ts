import axios from 'axios';

interface editChatRequest {
    name: string | null;
    id_priority: string | null;
    id_group: string | null;
    id_user: string | null;
    id_chat: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function editChat({ name, id_priority, id_group, id_user, id_chat }: editChatRequest) { // Função para criar uma conta
    const response = await axios.post(`${API_BASE_URL}/chats/edit`, { name, id_priority, id_group, id_user, id_chat  }); // Usa a URL base da API

    if (response.status === 200) { // Verifica se a resposta foi bem-sucedida
        return 'Chat alterado com sucesso!'; // Retorna uma mensagem de sucesso
    } else {
        return 'Não foi possível alterar o chat. Tente novamente!'; // Retorna uma mensagem de erro
    }
}