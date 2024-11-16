import axios from 'axios';

interface uploadPhotoRequest {
    id_user: string;
    photo: string;  // Corrigido para o tipo string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadPhoto({ photo, id_user }: uploadPhotoRequest): Promise<string> {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/photo`, { photo, id_user });

        if (response.status === 200) {
            return 'Foto alterada com sucesso!';
        } else {
            return 'Não foi possível alterar a foto. Tente novamente!';
        }
    } catch (error: any) {
        // Aqui capturamos o erro e mostramos a mensagem de erro detalhada
        console.error('Erro ao enviar foto:', error);

        // Verifica se o erro possui resposta da API e retorna a mensagem de erro
        if (error.response && error.response.data && error.response.data.message) {
            return `Erro: ${error.response.data.message}`;
        }

        return 'Ocorreu um erro ao enviar a foto. Tente novamente!';
    }
}
