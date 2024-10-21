import axios from 'axios';

interface verifyTokenRequest {
    pin: string;
    email: string | undefined;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function verifyToken({ pin, email }: verifyTokenRequest) {
    try {
        // Envia o OTP (pin) para a API para verificação
        const response = await axios.post(`${API_BASE_URL}/verify`, { otp: pin, email: email });

        // Verifica se a resposta foi bem-sucedida
        if (response.status === 200) {
            // OTP verificado com sucesso
            console.log('OTP verificado com sucesso:', response.data);
            return { success: true, message: response.data };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Trata erro específico da Axios
            console.error('Erro ao verificar OTP:', error.response?.data);
            return { success: false, message: error.response?.data || 'Erro ao verificar OTP' };
        } else {
            // Trata erro genérico
            console.error('Erro desconhecido:', error);
            return { success: false, message: 'Erro desconhecido' };
        }
    }
}