import axios from 'axios';

interface GetAccountIdRequest {
    id: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function getAccountId({ id }: GetAccountIdRequest) {
    const response = await axios.get(`${API_BASE_URL}/users/accountProfile/${id}`);

    if (response.status === 200) {
        return response.data;
    } else {
        return 'Não foi possível buscar a conta. Tente novamente!';
    }
}