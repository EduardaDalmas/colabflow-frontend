import axios from 'axios';

interface editChatRequest {
    id_user: string | null;
    name: string | null;
    id_group: string | null;
    id_priority: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function editChat({ id_user, name, id_group, id_priority  }: editChatRequest) { // Função para criar uma conta
    const response = await axios.post(`${API_BASE_URL}/chats/edit`, { id_user, name, id_group, id_priority }); // Usa a URL base da API

    if (response.status === 200) { // Verifica se a resposta foi bem-sucedida
        return 'Chat alterado com sucesso!'; // Retorna uma mensagem de sucesso
    } else {
        return 'Não foi possível alterar o chat. Tente novamente!'; // Retorna uma mensagem de erro
    }
}