import axios from 'axios';

interface GroupOwner {
    id_group: any | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getGroupOwner({ id_group }: GroupOwner): Promise<GroupOwner> {
    try {
        // Fazendo a requisição para buscar perfis de acordo com o ID do usuário
        const response = await axios.get(`${API_BASE_URL}/group/owner/${id_group}`);
        
        // Retorna os perfis formatados conforme a resposta da API
        const data = response.data;
        return data;
     

    } catch (error) {
        throw new Error('Não foi possível buscar o dono dos grupos');
    }
}
