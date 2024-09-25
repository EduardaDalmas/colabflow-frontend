import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { AtSign, Mail, MessageCircleCode, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAccount } from "@/http/get-account";
import { editAccount } from "@/http/edit-account";	
import { useEffect, useState } from "react";

// Função para obter iniciais do nome
function getInitials(fullName: string) {
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
        const firstInitial = nameParts[0].charAt(0);
        const lastInitial = nameParts[nameParts.length - 1].charAt(0);
        return firstInitial + lastInitial;
    }
    return fullName.charAt(0);
}

export function Account() {
    
    const [username, setUsername] = useState(''); // Estado para o nome do usuário
    const [useremail, setUserEmail] = useState(''); // Estado para o email do usuário
    const [userId, setUserId] = useState(''); // Estado para o id do usuário
    const navigate = useNavigate();
    const { name, email } = useAuth(); // Pegando dados do contexto de autenticação
    const [accountError, setAccountError] = useState('');
    const [accountSucess, setAccountSucess] = useState('');

    // Função para buscar os dados da conta
    const fetchAccount = async () => {
        const response = await getAccount({ email });
        setUsername(response.name); // Atualiza o nome no estado
        setUserEmail(response.email); // Atualiza o email no estado
        setUserId(response.id); // Atualiza o id no estado
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
    
        try {
            const response = await editAccount({ email: useremail, name: username, id: userId });
            
            if (response && response.status === 200) {
                setAccountSucess('Conta editada com sucesso');
                setAccountError('');
            } else {
                setAccountError('Erro ao editar a conta');
                setAccountSucess('');
            }
        } catch (error) {
            // Caso a requisição falhe, capturamos o erro aqui
            setAccountError('Erro ao editar a conta');
            setAccountSucess('');
            console.error('Erro ao editar a conta:', error);
        }
    }
    

    useEffect(() => {
        fetchAccount();
    }, []);

    // Função para permitir edição do nome
    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleChangeMail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value);
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-medium text-white mb-10">
                Meus dados
            </h1>
            <div className="flex items-center justify-center py-4">
            {accountSucess && (
              <div className="bg-green-500 text-white text-lg font-semibold rounded-md shadow-lg p-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {accountSucess}
              </div>
            )}

            {accountError && (
                <div className="bg-red-500 text-white text-lg font-semibold rounded-md shadow-lg p-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {accountError}
                </div>
              )}
          </div>

            <form
                onSubmit={handleSubmit}
                className='flex flex-col border border-zinc-800 p-10 items-center rounded-2xl shadow-shape justify-center' 
            >
                <div className="flex flex-row items-center mb-4 p-5">
                    <Avatar className="w-20 h-20">
                        <AvatarFallback className="bg-zinc-300 text-zinc-950 text-2xl hover:bg-indigo-500">
                            {getInitials(name)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <Mail size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        name='email'
                        type="email" 
                        placeholder="Email"  
                        value={useremail}
                        onChange={handleChangeMail} // Atualiza o valor do input ao digitar
                        
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <User size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        name='name'
                        type="name" 
                        placeholder="Nome"  
                        value={username}
                        onChange={handleChangeName} // Atualiza o valor do input ao digitar
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <AtSign size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        name='link'
                        type="link" 
                        placeholder="Link profile"  
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <div className="relative mt-3 flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                    <MessageCircleCode size={24} className="absolute left-3 text-gray-400" />
                    <Input 
                        name='status'
                        type="status" 
                        placeholder="Status"  
                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                    />
                </div>

                <Button
                    type="submit"
                    className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-10 hover:bg-indigo-500 shadow-shape"
                >
                    Salvar
                </Button>
            </form>
        </div>
    );
}
