import axios from 'axios';

interface createProfileRequest {
    description: string;
    id_user: string | null;

}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createProfile({ description, id_user }: createProfileRequest) {
    const response = await axios.post(`${API_BASE_URL}/profiles`, { description, id_user });

    if (response.status === 201) {
        return 'Perfil criado com sucesso!';
    } else {
        return 'Não foi possível criar o perfil. Tente novamente!';
    }
}