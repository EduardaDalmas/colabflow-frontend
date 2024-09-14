import axios from 'axios';

interface GetTokenEmailRequest {
    email: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTokenEmail({ email }: GetTokenEmailRequest) { // Função para obter o token de acesso
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email }); // Faz a requisição para obter o token de acesso

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
