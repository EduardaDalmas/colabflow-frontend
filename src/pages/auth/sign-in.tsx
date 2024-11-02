import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import bg from '@/assets/moldura.png'; // Certifique-se de que o caminho está correto
import logo from '@/assets/logo.png'; // Certifique-se de que o caminho está correto
import { Input } from '@/components/ui/input';
import { User } from "lucide-react";
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
// @ts-ignore
import { useAuth } from '../../context/AuthContext';

// @ts-ignore
import { getTokenEmail } from '@/http/get-token-email';

export function SignIn() {
    const navigate = useNavigate();
    // const { login } = useAuth();
    const [error, setError] = useState('');
    // const { setEmail, setName } = useAuth();

    function CreateAccount() {
        navigate("/create-account")
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const data = new FormData(event.currentTarget);
            const email = data.get('email')?.toString();

            if (!email) {
                return toast.error('Insira o e-mail para receber o token de acesso!');
            }

            const response = await getTokenEmail({ email });

            if (response) {
                navigate(`/send-token/${email}`);
            } else {
                toast.error('E-mail não encontrado. Tente novamente!');
            }

        } catch (error) {
            console.error(error);
            setError('Erro ao fazer login. Tente novamente.');
            setTimeout(() => {
                setError('');
              }, 3000); // 3 segundos
        }
    }

    return (
        <div className="relative h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Coluna da Esquerda */}
            <div className="relative flex flex-col items-center justify-center h-full p-8">
                <div className="relative flex flex-col items-center text-center z-10 px-4 md:px-8">
                    <h1 className="text-2xl md:text-3xl mb-4 md:mb-6 text-indigo-400 line-through max-w-md">
                        Nunca mais perca o fio da meada nas suas interações.
                    </h1>
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-40 h-40 md:w-72 md:h-52 mb-4 md:mb-6 object-contain"
                    />
                    <h2 className="text-sm md:text-lg mb-4 max-w-md leading-6 md:leading-7 font-extralight text-white">
                        Chat colaborativo que organiza as atividades dos seus times, ajudando sua equipe a priorizar e manter o foco no que realmente importa.
                    </h2>
                    <Button
                        onClick={CreateAccount}
                        className="bg-indigo-700 border-none text-sm md:text-base text-white font-bold rounded-2xl h-10 md:h-12 w-56 md:w-64 mt-5 hover:bg-indigo-500 shadow-shape"
                    >
                         Criar conta
                    </Button>
                </div>
            </div>

            {/* Coluna da Direita */}
            <div className="relative flex items-center justify-center h-full">
                <img
                    src={bg}
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-cover z-[-1]"
                />
                <div className="relative max-w-lg w-full px-6 text-center space-y-10 bg-zinc-800 min-h-96 rounded-xl shadow-shape z-10">
                    <div className="flex flex-col items-center gap-3 pt-3">
                        <img
                            src={logo}
                            alt="Logo do ColabFlow"
                            className="h-32 w-auto mx-auto m-3"
                        />

                        <form 
                            onSubmit={handleSubmit}
                            className='flex flex-col border border-zinc-800 items-center justify-center'
                        > 
                            <h1 className="text-xl font-medium text-white mb-5">Login</h1>
                            <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm">
                                <User size={24} className="absolute left-3 text-gray-400" />
                                <Input 
                                    name='email'
                                    type="email" 
                                    placeholder="Email"  
                                    className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                                />
                            </div>
                            {error && <p className="text-red-500 mb-4">{error}</p>}

                            <Button
                                type="submit"
                                className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-5 hover:bg-indigo-500 shadow-shape"
                            >
                                Enviar código
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
