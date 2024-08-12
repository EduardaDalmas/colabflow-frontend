import { toast } from 'sonner';
import logo from '@/assets/logotipo.png';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '@/http/verify-token';

const FormSchema = z.object({
    pin: z.string().min(6, {
      message: "Your one-time password must be 6 characters.",
    }),
  })

export function SendToken() {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          pin: "",
        },
      })

      async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        toast(`You submitted the following values: ${JSON.stringify(data, null, 2)}`)

        if (!data) {
            return toast.error('Insira o token enviado para seu email para acessar sua conta!')
        } 

        await verifyToken({ pin: data.pin });
        toast.success('Conta criada com sucesso!');

        navigate(`/home`)
      }


    return (
        <div className="flex items-center justify-center">
            <div className="max-w-lg w-full px-6 text-center space-y-10 bg-zinc-800 h-96 rounded-xl">
                <div className="flex flex-col items-center gap-3 pt-3">
                    <img
                        src={logo}
                        alt="Logo da Empresa Doctor Clin"
                        className="h-32 w-auto mx-auto m-3"
                    />
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className=' border-zinc-800 items-center justify-center'
                        > 
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className='font-medium text-md'>Insira o código que foi enviado para seu e-mail</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className='h-16 w-16 text-lg'/>
                                            <InputOTPSlot index={1} className='h-16 w-16 text-lg'/>
                                            <InputOTPSlot index={2} className='h-16 w-16 text-lg'/>
                                            <InputOTPSlot index={3} className='h-16 w-16 text-lg'/>
                                            <InputOTPSlot index={4} className='h-16 w-16 text-lg'/>
                                            <InputOTPSlot index={5} className='h-16 w-16 text-lg'/>
                                        </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit"
                                className="bg-purple-600 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-5 hover:bg-purple-500"
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