import axios from 'axios';

interface EditAccountRequest {
    email: string;
    name: string;
    link_profile?: string;
    status?: string;
    id: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function editAccount({ email, name, link_profile, status, id }: EditAccountRequest) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/account/edit`, {
            email,
            name,
            link_profile,
            status,
            id,
        });

        return response; // Retornamos a resposta diretamente

    } catch (error) {
        console.error('Erro ao editar a conta', error);
        throw new Error('Erro ao editar a conta'); // Lançamos o erro para ser capturado no handleSubmit
    }
}
