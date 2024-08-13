import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Home() {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-medium text-white mb-5">
                Minhas equipes
            </h1>

           
           <Tabs defaultValue="account" className="flex flex-col h-full w-2/3">
                <TabsList className="flex lg:mb-5 mb-1 bg-transparent border border-zinc-700 bg-zinc-950 rounded-2xl min-h-12">
                    <TabsTrigger value="account"  className="flex-1 rounded-2xl min-h-10">Meus Grupos</TabsTrigger>
                    <TabsTrigger value="password"  className="flex-1 rounded-2xl min-h-10">Sou Participante</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto">
                    <TabsContent value="account" className="w-full">Content 1</TabsContent>
                    <TabsContent value="password" className="w-full">Content 2</TabsContent>
                </div>
            </Tabs>
           

        </div>
    )
}