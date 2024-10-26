import axios from 'axios';

interface deleteUserChatRequest {
    id_chat: string;
    id_user: string;
    }


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function deleteUserChat({ id_chat, id_user }: deleteUserChatRequest) {
    console.log('ID CHAT', id_chat)
    console.log('EMAIL', id_user)
    const response = await axios.post(`${API_BASE_URL}/chatsuser/${id_chat}/${id_user}`); // Usa a URL base da API

    if (response.status === 200) { // Verifica se a resposta foi bem-sucedida
        return 'Usuário removido com sucesso!'; // Retorna uma mensagem de sucesso
    } else {
        return 'Não foi possível remover o usuário do chat. Tente novamente!'; // Retorna uma mensagem de erro
    }

}