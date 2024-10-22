import axios from 'axios';

interface getLinksRequest {
    id_chat: string | null;
}

interface Link {
    id: string;
    id_chat: string;
    id_user: string;
    link: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getLinks({ id_chat }: getLinksRequest): Promise<Link[]> {
    try {

        const response = await axios.get(`${API_BASE_URL}/links/${id_chat}`);
        
        // Retorna os perfis formatados conforme a resposta da API
        const data: Link[] = response.data.map((link: any) => ({
            id: link.id,
            link: link.link,
        }));

        return data;

    } catch (error) {
        console.error('Erro ao buscar links:', error);
        throw new Error('Não foi possível buscar os links');
    }
}
