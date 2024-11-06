import axios from 'axios';

interface editGroupRequest {
    id: string;
    description: string;
    id_user: string | null;

}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function editGroup({ id, description, id_user }: editGroupRequest) {
    const response = await axios.post(`${API_BASE_URL}/groups/edit`, { description, id_user, id });

    if (response.status === 201) {
        return 'Perfil editado com sucesso!';
    } else {
        return 'Não foi possível editar o perfil. Tente novamente!';
    }
}