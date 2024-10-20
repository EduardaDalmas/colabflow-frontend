import axios from 'axios';

interface getProfilesRequest {
    id_user: string | null;
}

interface Profile {
    id: string;
    name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProfiles({ id_user }: getProfilesRequest): Promise<Profile[]> {
    try {
        // Fazendo a requisição para buscar perfis de acordo com o ID do usuário
        const response = await axios.get(`${API_BASE_URL}/profiles/${id_user}`);
        
        // Retorna os perfis formatados conforme a resposta da API
        const data: Profile[] = response.data.map((profile: any) => ({
            id: profile.id,
            name: profile.name,  // Garantindo que usamos 'name' no frontend
        }));

        return data;

    } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        throw new Error('Não foi possível buscar os perfis');
    }
}
