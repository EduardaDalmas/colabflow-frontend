import { toast } from 'sonner';
import logo from '@/assets/logo.png';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
// @ts-ignore
import { verifyToken } from '@/http/verify-token';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Dgite o código correto com 6 caracteres.",
    }),
})

export function SendToken() { // Página de envio de token
    const navigate = useNavigate(); // Navegação entre páginas
    const { email } = useParams(); // Captura o parâmetro email da URL
    const [Error, setError] = useState('');
    const [Sucess, setSuccess] = useState('');
    const { setEmail, setName } = useAuth();
    const { login } = useAuth();


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) { // Função para lidar com o envio do formulário
        console.log(data)
        toast(`You submitted the following values: ${JSON.stringify(data, null, 2)}`)

        if (!data) {
            return toast.error('Insira o token enviado para seu email para acessar sua conta!')
        }
        try {


            const response = await verifyToken({ pin: data.pin, email: email });



            if (response) {
                if (response.success) {
                    setSuccess(response.message); // Mensagem de sucesso
                    const token = response.message.token; // Obtém o token da resposta
                    localStorage.setItem('token', token);
                    localStorage.setItem('user_id', response.message.user.id);
                    setName(response.message.user.name);
                    setEmail(response.message.user.email);
                    login(token);
                    setError(""); // Limpa qualquer mensagem de erro anterior
                    console.log(response.message.user.profiles);
                    if (response.message.user.profiles > 1) {
                        navigate('/profiles'); // Navega para a página inicial
                    } else {
                        navigate('/home'); // Navega para a página inicial
                    }
                } else {
                    setError(response.message); // Mensagem de erro
                    setSuccess(""); // Limpa qualquer mensagem de sucesso anterior
                }
            } else {
                setError('Erro ao verificar o token. Tente novamente.'); // Caso a resposta seja undefined
            }
        } catch (error) {
            console.error(error);
            setError('Erro ao verificar o token. Tente novamente.');
            setSuccess(""); // Limpa qualquer mensagem de sucesso anterior
        }
    }


    return (

        
        <div className="flex items-center justify-center">
            
            <div className=""> 
                {Sucess && (
                    <div className="bg-green-500 text-white text-sm font-semibold rounded-md shadow-lg p-3 flex items-center max-w-xs mx-auto">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {Sucess}
                    </div>
                )}

                {Error && (
                    <div className="bg-red-500 text-white text-sm font-semibold rounded-md shadow-lg p-3 flex items-center max-w-xs mx-auto">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {Error}
                    </div>
                )}
            </div>

            <div className="max-w-lg w-full px-6 text-center space-y-10 bg-zinc-800 h-96 rounded-xl">

                <div className="flex flex-col items-center gap-3 pt-3">

                    <img
                        src={logo}
                        alt="Logo ColabFlow"
                        className="h-32 w-auto mx-auto m-3"
                    />
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className=' border-zinc-800 flex flex-col items-center justify-center'
                        >
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col items-center justify-center text-center'>
                                        <FormLabel className='font-medium text-md mb-4'>Insira o código que foi enviado para seu e-mail</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <div className="flex gap-2">
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </div>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-5 hover:bg-indigo-500"
                            >
                                Acessar
                            </Button>

                        </form>
                    </Form>

                </div>
            </div>
        </div>
    )
}
