import axios from 'axios';

interface deleteLinkRequest {
    id_link: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function deleteLink({ id_link  }: deleteLinkRequest) { 
    console.log('ID LINK', id_link)
    const response = await axios.delete(`${API_BASE_URL}/links/${id_link}`); // Usa a URL base da API

    if (response.status === 200) { // Verifica se a resposta foi bem-sucedida
        return 'Link deletado com sucesso!'; // Retorna uma mensagem de sucesso
    } else {
        return 'Não foi possível deletar o link. Tente novamente!'; // Retorna uma mensagem de erro
    }
}