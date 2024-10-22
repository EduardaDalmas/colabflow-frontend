import axios from 'axios';

interface createLinkRequest {
    id_chat: string | null;
    id_user: string | null;
    link: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createLink({ id_chat, id_user, link  }: createLinkRequest) { 
    const response = await axios.post(`${API_BASE_URL}/links`, { id_chat, id_user, link }); // Usa a URL base da API

    if (response.status === 200) { // Verifica se a resposta foi bem-sucedida
        return 'Link registrado com sucesso!'; // Retorna uma mensagem de sucesso
    } else {
        return 'Não foi possível registrar o link. Tente novamente!'; // Retorna uma mensagem de erro
    }
}