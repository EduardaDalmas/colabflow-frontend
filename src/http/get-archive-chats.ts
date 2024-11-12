import axios from 'axios';

interface GetArchiveChatRequest {
  id_group: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getArchiveChats({ id_group }: GetArchiveChatRequest) {
  try {
    const response = await axios.get(`${API_BASE_URL}/chats-archive/${id_group}`);

    if (response.status === 200) {
      return response.data;
    } else {
      return 'Não foi possível buscar chats arquivados. Tente novamente!';
    }
  } catch (error) {
    return 'Erro na requisição. Tente novamente!';
  }
}
