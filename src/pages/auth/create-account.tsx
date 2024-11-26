import { Input } from '@/components/ui/input'
import { Mail, User } from "lucide-react";
import { Button } from '@/components/ui/button';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { toast, ToastContainer } from 'react-toastify';
// @ts-ignore
import { motion } from 'framer-motion';
import { PropagateLoader } from 'react-spinners';

// @ts-ignore
import { createAccount } from '@/http/create-account';
import { useAuth } from '@/context/AuthContext';

export function CreateAccount() {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const { setEmail, setName } = useAuth();
    const [userError, setUserError] = useState('');
    const [userSucess, setUserSuccess] = useState('');
    

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Previne o comportamento padrão do formulário
        setLoading(true);

        try {
            const data = new FormData(event.currentTarget); // Cria um objeto FormData com os dados do formulário
            const name = data.get('name')?.toString().trim(); // Obtém o valor do campo de nome e remove espaços extras
            const email = data.get('email')?.toString().trim(); // Obtém o valor do campo de e-mail e remove espaços extras
    
            if (!name) { 
                return toast.error('Insira o nome para criar sua conta de acesso!');
            } 
            
            // Verificar se o nome contém pelo menos duas palavras (nome e sobrenome)
            const nameParts = name.split(' ').filter(part => part.length > 0); // Divide o nome e remove partes vazias
            if (nameParts.length < 2) {
                setLoading(false);
                return toast.error('Insira o nome completo (nome e sobrenome) para continuar.');
            }
    
            if (!email) {
                setLoading(false);
                return toast.error('Insira o e-mail para criar sua conta de acesso!');
            } 
    
            setName(name); // Define o nome do usuário
            setEmail(email); // Define o e-mail do usuário
    
            // Faz a requisição para registrar o usuário e aguarda a resposta
            await createAccount({ name, email });
            setUserSuccess('Conta criada com sucesso!');
            setTimeout(() => {
                setUserSuccess('');
            }, 3000); // 3 segundos
            setLoading(false);
            navigate(`/send-token/${email}`);
        } catch {
            setUserError('Não foi possível criar a conta. Tente novamente!');
            setTimeout(() => {
                setUserError('');
            }, 3000); // 3 segundos
        }
    }
    

    function TermsPrivacy() {
        navigate('/terms-privacy');
    }

    return (
        <div>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-zinc-900">
                    <PropagateLoader color="#6366F1" loading={loading} size={15} />
                </div>
            ) : (
      
                    <div className="flex items-center justify-center">
                    <ToastContainer />

                    <div className="max-w-lg w-full px-6 text-center space-y-10 bg-zinc-800 h-auto rounded-xl">

                        <div className="flex items-center justify-center py-4">
                            {userSucess && (
                                <div className="bg-green-500 text-white text-sm font-semibold rounded-md shadow-lg p-3 flex items-center max-w-xs mx-auto">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {userSucess}
                                </div>
                            )}

                            {userError && (
                                <div className="bg-red-500 text-white text-sm font-semibold rounded-md shadow-lg p-3 flex items-center max-w-xs mx-auto">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {userError}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-3 pt-3">
                            <img
                                src={logo}
                                alt="Logo da ColabFlow"
                                className="h-32 w-auto mx-auto m-3"
                            />
                            <form 
                                onSubmit={handleSubmit}
                                className='flex flex-col border border-zinc-800 items-center justify-center'
                            > 
                                <h1 className="text-xl font-medium text-white mb-5">Criar conta</h1>
                                <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm mb-5">
                                    <User size={24} className="absolute left-3 text-gray-400" />
                                    <Input 
                                        id='name'
                                        name='name'
                                        type="text" 
                                        placeholder="Nome"  
                                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                                    />
                                </div>
                                <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                                    <Mail size={24} className="absolute left-3 text-gray-400" />
                                    <Input 
                                        id='email'
                                        name='email'
                                        type="email" 
                                        placeholder="Email"  
                                        className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                                    />
                                </div>
                                <div onClick={TermsPrivacy}>
                                    <p className="text-zinc-300 text-xs mt-3 max-w-80">
                                        Ao clicar em <b>Cadastrar</b>, você concorda com nossos{' '}
                                        <span 
                                            className="underline text-blue-400 hover:text-blue-300 cursor-pointer"
                                        >
                                            Termos de Serviço
                                        </span>{' '}
                                        e{' '}
                                        <span 
                                            className="underline text-blue-400 hover:text-blue-300 cursor-pointer"
                                        >
                                            Política de Privacidade
                                        </span>.
                                    </p>
                                </div>

                                <Button
                                    id='create-account'
                                    type="submit"
                                    className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-7 mb-10 hover:bg-indigo-500"
                                >
                                    Cadastrar
                                </Button>
                            </form>
                        
                        </div>
                    </div>
                </div>
            )}
          </div>
    )
}