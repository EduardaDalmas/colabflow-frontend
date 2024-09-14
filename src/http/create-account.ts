import axios from 'axios';

interface createAccountRequest {
    name: string;
    email: string;
}

export async function createAccount({ name, email }: createAccountRequest) {
    const response = await axios.post('http://localhost:3001/api/register', { name, email });

    if (response.status === 200) {
        return 'Conta criada com sucesso!';
    } else {
        return 'Não foi possível criar a conta. Tente novamente!';
    }
}