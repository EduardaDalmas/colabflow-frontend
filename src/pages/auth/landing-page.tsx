import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import bg from '@/assets/bg-landing.png'; // Certifique-se de que o caminho está correto

export function LandingPage() {
    const navigate = useNavigate();

    function acessar() {
        console.log('Acessou a página');
        navigate('/sign-in');
    }

    return (
        <div className="relative h-screen overflow-hidden">
            <img
                src={bg}
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
                <h1 className="text-4xl mb-4">Landing page</h1>
                <Button
                    onClick={acessar}
                    className="bg-indigo-700 border-none text-base text-white font-bold rounded-2xl h-12 w-64 mt-5 hover:bg-indigo-500 shadow-shape"
                >
                    Vamos começar
                </Button>
            </div>
        </div>
    );
}
