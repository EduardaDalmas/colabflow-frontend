import { Input } from '@/components/ui/input'
import { Mail, User } from "lucide-react";
import { Button } from '@/components/ui/button';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

// @ts-ignore
import { createAccount } from '@/http/create-account';
import { useAuth } from '@/context/AuthContext';

export function CreateAccount() {
    const navigate = useNavigate();
    

    const { setEmail, setName } = useAuth();
    const [userError, setUserError] = useState('');
    const [userSucess, setUserSuccess] = useState('');
    

    async function handleSubmit(event: FormEvent<HTMLFormElement>) { // Função para lidar com o envio do formulário
        event.preventDefault() // Previne o comportamento padrão do formulário

        try {
            const data = new FormData(event.currentTarget) // Cria um objeto FormData com os dados do formulário
            const name = data.get('name')?.toString() // Obtém o valor do campo de nome
            const email = data.get('email')?.toString() // Obtém o valor do campo de e-mail

           if (!name) { // Verifica se o campo de nome está vazio
                return toast.error('Insira o nome para criar sua conta de acesso!')
            } else  if (!email) {
                return toast.error('Insira o e-mail para criar sua conta de acesso!')
            } 
            setName(name) // Define o nome do usuário
            setEmail(email) // Define o e-mail do usuário
            
            // Faz a requisição para registrar o usuário e aguarda a resposta
            await createAccount({ name, email });
            setUserSuccess('Conta criada com sucesso!');
            setTimeout(() => {
                setUserSuccess('');
              }, 3000); // 3 segundos
            navigate(`/send-token/${email}`)
        } catch {
            //toast.error('Não foi possível criar a conta. Tente novamente!')
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
        
        <div className="flex items-center justify-center">
            

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
                                name='name'
                                type="text" 
                                placeholder="Nome"  
                                className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                            />
                        </div>
                         <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                            <Mail size={24} className="absolute left-3 text-gray-400" />
                            <Input 
                                name='email'
                                type="email" 
                                placeholder="Email"  
                                className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                            />
                        </div>
                        <div onClick={TermsPrivacy}>
                            <p className="text-zinc-300 text-xs mt-3 max-w-80">Ao clicar em <b>Cadastrar</b>, você concorda com nossos Termos de Serviço e Política de Privacidade.</p>
                        </div>
                        <Button
                            type="submit"
                            className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-7 mb-10 hover:bg-indigo-500"
                        >
                            Cadastrar
                        </Button>
                    </form>
                  
                </div>
            </div>
        </div>
    )
}