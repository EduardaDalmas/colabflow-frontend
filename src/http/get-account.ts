import axios from 'axios';

interface GetAccountRequest {
    email: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAccount({ email }: GetAccountRequest) {
    const response = await axios.get(`${API_BASE_URL}/users/account/${email}`);

    if (response.status === 200) {
        return response.data;
    } else {
        return 'Não foi possível buscar a conta. Tente novamente!';
    }
}
