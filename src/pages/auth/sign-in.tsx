import { Input } from '@/components/ui/input'
import logo  from '../../assets/logotipo.png'
import { User } from "lucide-react";
import { Button } from '@/components/ui/button';

export function SignIn() {
    return (
        <div className="flex items-center justify-center">
            <div className="max-w-lg w-full px-6 text-center space-y-10 bg-zinc-800 h-96 rounded-xl">
                <div className="flex flex-col items-center gap-3 bebas-neue">
                    <img
                        src={logo}
                        alt="Logo da Empresa Doctor Clin"
                        className="h-32 w-auto mx-auto m-3"
                    />

                    <form className='flex flex-col border border-zinc-800 items-center justify-center'> 
                        <div className="relative flex items-center bg-zinc-900 border-zinc-800 rounded-xl max-w-sm ">
                            <User size={24} className="absolute left-3 text-gray-400" />
                            <Input 
                                type="email" 
                                placeholder="Email"  
                                className="pl-10 pr-4 py-2 text-lg rounded-2xl h-12 w-80 border bg-transparent border-none " 
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-orange-500 border-none text-black font-bold rounded-2xl h-12 w-64 mt-5 hover:bg-orange-400"
                        >
                            Enviar código
                        </Button>
                    </form>
                    <a href="#" className="text-zinc-300 p-5">Criar conta <b>aqui</b></a>
                </div>
            </div>
        </div>
    )
}