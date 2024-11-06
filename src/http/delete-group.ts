import axios from 'axios';

interface deleteGroupRequest {
    id: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function deleteGroup({ id }: deleteGroupRequest) {
    const response = await axios.post(`${API_BASE_URL}/groups/delete`, { id });

    if (response.status === 201) {
        return 'Grupo deletado com sucesso!';
    } else {
        return 'Não foi possível deletar o grupo. Tente novamente!';
    }
}