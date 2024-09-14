import axios from 'axios';

interface signInRequest {
    email: string;
    
}

export async function signIn({ email }: signInRequest) {
    const response = await axios.post('http://localhost:3001/api/login', { email });

    if (response.status === 200) {
        return 'Conta criada com sucesso!';
    } else {
        return 'Não foi possível criar a conta. Tente novamente!';
    }
}