import axios from 'axios';

interface editGroupRequest {
    id: string;
    name: string;
    id_user: string | null;

}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function editGroup({ id, name, id_user }: editGroupRequest) {
    const response = await axios.post(`${API_BASE_URL}/groups/edit`, { id, name, id_user  });

    if (response.status === 201) {
        return 'Grupo editado com sucesso!';
    } else {
        return 'Não foi possível editar o grupo. Tente novamente!';
    }
}