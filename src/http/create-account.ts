import axios from 'axios';

interface createAccountRequest {
    name: string;
    email: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createAccount({ name, email }: createAccountRequest) { // Função para criar uma conta
    const response = await axios.post(`${API_BASE_URL}/register`, { name, email }); // Usa a URL base da API

    if (response.status === 200) { // Verifica se a resposta foi bem-sucedida
        return 'Conta criada com sucesso!'; // Retorna uma mensagem de sucesso
    } else {
        return 'Não foi possível criar a conta. Tente novamente!'; // Retorna uma mensagem de erro
    }
}