import axios from 'axios';

interface createGroupRequest {
    name: string;
    id_context: string | undefined;
    id_user: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createGroup({ name, id_context, id_user }: createGroupRequest) {
    const response = await axios.post(`${API_BASE_URL}/groups`, { name, id_context, id_user });

    if (response.status === 201) {
        return 'Grupo criado com sucesso!';
    } else {
        return 'Não foi possível criar o grupo. Tente novamente!';
    }
}