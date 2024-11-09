import axios from 'axios';

interface getGroupsRequest {
    id_user: string | null;
    id_context: string | undefined;
}

interface getGroupByChatUserRequest {
    id_user: string | null;
}

interface Group {
    id: string;
    name: string;
    id_context: string;
    id_user: string;
    id_priority: string;
    priority: {
        id: string;
        name: string;
    }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getGroups({ id_user, id_context }: getGroupsRequest): Promise<Group[]> {
    try {
        // Fazendo a requisição para buscar perfis de acordo com o ID do usuário
        // const response = await axios.get(`${API_BASE_URL}/groups/${id_user}`);
        // faz a requisição para buscar perfis de acordo com o ID do usuário e o ID do contexto
        const response = await axios.get(`${API_BASE_URL}/groups/${id_user}/${id_context}`);
        
        // Retorna os perfis formatados conforme a resposta da API
        const data: Group[] = response.data.map((group: any) => ({
            id: group.id,
            name: group.name,  // Garantindo que usamos 'name' no frontend
            id_context: group.id_context,
            priority: {
                id: group.priority.id,
                name: group.priority.name
            },
            id_owner: group.id_owner,
        }));

        return data;

    } catch (error) {
        console.error('Erro ao buscar grupos:', error);
        throw new Error('Não foi possível buscar os grupos');
    }
}

//função para buscar grupos ao qual possuem chats em que o usuário está inserido

export async function getGroupByChatUser({ id_user }: getGroupByChatUserRequest): Promise<Group[]> {
    try {
        // Fazendo a requisição para buscar perfis de acordo com o ID do usuário
        const response = await axios.get(`${API_BASE_URL}/groups/by-chat/${id_user}`);
        
        // Retorna os perfis formatados conforme a resposta da API
        const data: Group[] = response.data.map((group: any) => ({
            id: group.id,
            name: group.name,  // Garantindo que usamos 'name' no frontend
            id_context: group.id_context,
            priority: {
                id: group.priority.id,
                name: group.priority.name
            }
        }));

        return data;

    } catch (error) {
        console.error('Erro ao buscar grupos:', error);
        throw new Error('Não foi possível buscar os grupos');
    }
}


export async function getGroupOwner({ id_group }: { id_group: string | null}): Promise<string> {
    try {
        // Fazendo a requisição para buscar perfis de acordo com o ID do usuário
        const response = await axios.get(`${API_BASE_URL}/groups/owner/${id_group}`);
        
        // Retorna os perfis formatados conforme a resposta da API
        const data: string = response.data;
        console.log(data);
        return data;

    } catch (error) {
        console.error('Erro ao buscar grupos:', error);
        throw new Error('Não foi possível buscar os grupos');
    }
}
