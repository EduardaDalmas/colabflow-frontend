import { Input } from '@/components/ui/input'
import { User } from "lucide-react";
import { Button } from '@/components/ui/button';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { getTokenEmail } from '@/http/get-token-email';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

export function SignIn() {
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        try {

            const data = new FormData(event.currentTarget)
            const email = data.get('email')?.toString()

            if (!email) {
                return toast.error('Insira o e-mail para receber o token de acesso!')
              }

            // await getTokenEmail({ email });
            // toast.success('Código enviado com sucesso!');

            navigate(`/send-token/${email}`)
        } catch {
            toast.error('Não foi possível enviar o token. Tente novamente!')
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-lg w-full px-6 text-center space-y-10 bg-zinc-800 min-h-96 rounded-xl shadow-shape">
                <div className="flex flex-col items-center gap-3 pt-3">
                    <img
                        src={logo}
                        alt="Logo da Taskflow"
                        className="h-32 w-auto mx-auto m-3"
                    />

                    <form 
                        onSubmit={handleSubmit}
                        className='flex flex-col border border-zinc-800 items-center justify-center'
                    > 
                        <h1 className="text-xl font-medium text-white mb-5">Login</h1>
                        <div className="relative flex items-center bg-zinc-950 border-zinc-800 rounded-xl max-w-sm ">
                            <User size={24} className="absolute left-3 text-gray-400" />
                            <Input 
                                name='email'
                                type="email" 
                                placeholder="Email"  
                                className="pl-12 pr-4 py-2 text-md rounded-2xl h-12 md:w-80 border bg-transparent border-none shadow-shape" 
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-5 hover:bg-indigo-500 shadow-shape"
                        >
                            Enviar código
                        </Button>
                    </form>
                    <a href="create-account" className="text-zinc-300 p-5 hover:text-zinc-400 mb-5">Criar conta <b>aqui</b></a>
                </div>
            </div>
        </div>
    )
}