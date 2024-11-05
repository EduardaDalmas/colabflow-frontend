import axios from 'axios';

interface editProfileRequest {
    id: string;
    description: string;
    id_user: string | null;

}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function editProfile({ id, description, id_user }: editProfileRequest) {
    const response = await axios.post(`${API_BASE_URL}/profiles/edit`, { description, id_user, id });

    if (response.status === 201) {
        return 'Perfil editado com sucesso!';
    } else {
        return 'Não foi possível editar o perfil. Tente novamente!';
    }
}