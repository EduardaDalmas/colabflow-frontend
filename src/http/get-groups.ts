import axios from 'axios';

interface getGroupsRequest {
    id_user: string | null;
}

interface Group {
    id: string;
    name: string;
    id_context: string;
    id_user: string;
    id_priority: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getGroups({ id_user }: getGroupsRequest): Promise<Group[]> {
    try {
        // Fazendo a requisição para buscar perfis de acordo com o ID do usuário
        const response = await axios.get(`${API_BASE_URL}/groups/${id_user}`);
        
        // Retorna os perfis formatados conforme a resposta da API
        const data: Group[] = response.data.map((group: any) => ({
            id: group.id,
            name: group.name,  // Garantindo que usamos 'name' no frontend
        }));

        return data;

    } catch (error) {
        console.error('Erro ao buscar grupos:', error);
        throw new Error('Não foi possível buscar os grupos');
    }
}
