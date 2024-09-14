import axios from 'axios';

interface GetTokenEmailRequest {
    email: string;
}

export async function getTokenEmail({ email }: GetTokenEmailRequest) {
    try {
        const response = await axios.post('http://localhost:3001/api/login', { email });

        // Verifica o status da resposta
        if (response.status === 200) {
            return response.data; // Retorna os dados diretamente, como o token e o usuário
        } else {
            throw new Error('E-mail não encontrado. Tente novamente!');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao se comunicar com o servidor.');
    }
}
