import { Input } from '@/components/ui/input'
import { Mail, User } from "lucide-react";
import { Button } from '@/components/ui/button';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { createAccount } from '@/http/create-account';
import { useAuth } from '@/context/authProvider';

export function CreateAccount() {
    const navigate = useNavigate();

    const { setEmail, setName } = useAuth();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        try {

            const data = new FormData(event.currentTarget)
            const name = data.get('name')?.toString()
            const email = data.get('email')?.toString()

           if (!name) {
                return toast.error('Insira o nome para criar sua conta de acesso!')
            } else  if (!email) {
                return toast.error('Insira o e-mail para criar sua conta de acesso!')
            } 

            setName(name)
            setEmail(email)

            // await createAccount({ name, email });
            // toast.success('Conta criada com sucesso!');

            navigate(`/send-token/${email}`)
        } catch {
            toast.error('Não foi possível criar a conta. Tente novamente!')
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-lg w-full px-6 text-center space-y-10 bg-zinc-800 h-auto rounded-xl">
                <div className="flex flex-col items-center gap-3 pt-3">
                    <img
                        src={logo}
                        alt="Logo da TaskFlow"
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
                        <div>
                            <p className="text-white text-xs mt-3 max-w-80">Ao clicar em <b>Cadastrar</b>, você concorda com nossos Termos de Serviço e Política de Privacidade.</p>
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