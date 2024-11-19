import axios from 'axios';

interface UploadPhotoRequest {
    id_user: string; // ID do usuário enviado separadamente
    // @ts-ignore
    photo: File;     // O arquivo será do tipo File
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadPhoto({ photo, id_user }: UploadPhotoRequest): Promise<string> {
    try {
        const formData = new FormData();

        // Adiciona o arquivo ao FormData
        formData.append('photo', photo); // photo já é um objeto File

        // Realiza o envio, incluindo o id_user na URL
        const response = await axios.post(`${API_BASE_URL}/user/photo/${id_user}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Necessário para envio de arquivo
            },
        });

        if (response.status === 200) {
            return 'Foto alterada com sucesso!';
        } else {
            return 'Não foi possível alterar a foto. Tente novamente!';
        }
    } catch (error: any) {
        console.error('Erro ao enviar foto:', error);

        if (error.response && error.response.data && error.response.data.message) {
            return `Erro: ${error.response.data.message}`;
        }

        return 'Ocorreu um erro ao enviar a foto. Tente novamente!';
    }
}
