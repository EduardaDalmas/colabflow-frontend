import axios from 'axios';

interface deleteProfileRequest {
    id: string;

}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function deleteProfile({ id }: deleteProfileRequest) {
    const response = await axios.post(`${API_BASE_URL}/profiles/delete`, { id });

    if (response.status === 201) {
        return 'Perfil deletado com sucesso!';
    } else {
        return 'Não foi possível deletar o perfil. Tente novamente!';
    }
}