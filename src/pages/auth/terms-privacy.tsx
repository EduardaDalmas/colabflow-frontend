import logo from '@/assets/logo.png';
import { Separator } from '@/components/ui/separator';

export function TermsPrivacy() {
    return (
        <div className="flex items-center justify-start">
            <div className="w-full md:px-6 text-left space-y-10 h-auto ">
                <div className="flex flex-col items-center gap-3 pt-3">
                    <img
                        src={logo}
                        alt="Logo do ColabFlow"
                        className="h-32 w-auto mx-auto m-3"
                    />
                    
                    <h1 className="md:text-3xl text-2xl font-semibold text-white">Termos de uso e privacidade</h1>
                </div>
                <div className='max-w-1/4'>
                    <h1 className='font-semibold md:text-xl text-lg mb-5 text-zinc-200' id='terms'>Termos de Serviço</h1>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>1. Introdução</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Bem-vindo ao <strong>ColabFlow</strong>! Esses Termos de Serviço
                        ("Termos") regem o uso da nossa plataforma de comunicação colaborativa.
                        Ao acessar ou utilizar o <strong>ColabFlow</strong>, você concorda com
                        estes Termos. Leia atentamente para garantir que você compreenda seus
                        direitos e obrigações.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>2. Aceitação dos Termos</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Ao usar o <strong>ColabFlow</strong>, você concorda em cumprir e ser
                        legalmente vinculado a estes Termos. Se você não concordar com estes
                        Termos, por favor, não utilize a plataforma. O uso contínuo do serviço
                        indica a aceitação das atualizações que possam ser feitas nestes Termos.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>3. Modificações nos Termos</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        O <strong>ColabFlow</strong> se reserva o direito de alterar ou modificar
                        estes Termos a qualquer momento. Notificaremos sobre mudanças
                        substanciais por meio da nossa plataforma ou por e-mail. A continuação
                        do uso do <strong>ColabFlow</strong> após qualquer modificação constitui
                        aceitação dos Termos modificados.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>4. Uso da Plataforma</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        O <strong>ColabFlow</strong> deve ser usado exclusivamente para fins
                        profissionais e de colaboração em tarefas. Você concorda em não usar o
                        serviço para atividades ilegais, abusivas ou para o envio de conteúdo
                        que viole os direitos de terceiros. Qualquer uso inadequado pode
                        resultar na suspensão ou encerramento da sua conta.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>5. Criação e Gerenciamento de Conta</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Você é responsável por manter a confidencialidade das credenciais da sua
                        conta. Você deve notificar imediatamente o <strong>ColabFlow</strong> em
                        caso de qualquer uso não autorizado da sua conta. O{' '}
                        <strong>ColabFlow</strong> não será responsável por perdas ou danos
                        resultantes do uso não autorizado da sua conta.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>6. Conteúdo do Usuário</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Você mantém todos os direitos sobre o conteúdo que você cria e compartilha no{' '}
                        <strong>ColabFlow</strong>. No entanto, ao compartilhar conteúdo, você concede
                        ao <strong>ColabFlow</strong> uma licença para armazenar e exibir esse conteúdo
                        conforme necessário para fornecer o serviço. O <strong>ColabFlow</strong> reserva-se
                        o direito de remover conteúdo que viole estes Termos ou a legislação aplicável.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>7. Propriedade Intelectual</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        O <strong>ColabFlow</strong> e todos os seus componentes, incluindo software,
                        design e conteúdo fornecido, são de propriedade exclusiva do <strong>ColabFlow</strong>
                        ou de seus licenciadores. Você não tem permissão para copiar, modificar, distribuir
                        ou vender qualquer parte do <strong>ColabFlow</strong> sem autorização prévia por escrito.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>8. Limitação de Responsabilidade</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        O <strong>ColabFlow</strong> não será responsável por quaisquer danos indiretos,
                        incidentais, especiais ou consequenciais decorrentes do uso da plataforma. Em
                        nenhuma circunstância a responsabilidade do <strong>ColabFlow</strong> excederá o valor
                        pago por você, se houver, para usar o serviço durante os seis meses anteriores ao
                        evento que gerou a responsabilidade.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>9. Cancelamento e Suspensão de Conta</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        O <strong>ColabFlow</strong> se reserva o direito de suspender ou encerrar sua conta
                        em caso de violação destes Termos ou de uso indevido da plataforma. Você pode
                        encerrar sua conta a qualquer momento, entrando em contato conosco. Todos os dados
                        associados à sua conta serão excluídos conforme nossa Política de Privacidade.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>10. Legislação Aplicável</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Estes Termos serão regidos e interpretados de acordo com as leis do país em que a
                        empresa está registrada. Qualquer disputa decorrente destes Termos será submetida à
                        jurisdição exclusiva dos tribunais competentes nesse local.
                    </p>
                    
                    <Separator orientation="horizontal" className='bg-zinc-500 mb-5 mt-5' />

                    <h1 className='font-semibold text-xl mb-5 text-zinc-200'>Política de Privacidade</h1>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>1. Introdução</h2>

                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        O <strong>ColabFlow</strong> valoriza sua privacidade. Esta Política de Privacidade
                        descreve como coletamos, usamos e compartilhamos suas informações pessoais ao usar
                        a nossa plataforma de comunicação colaborativa. Ao utilizar o <strong>ColabFlow</strong>,
                        você concorda com as práticas descritas nesta política.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>2. Informações Coletadas</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Coletamos informações pessoais que você nos fornece, como nome, endereço de e-mail
                        e informações de contato. Também coletamos dados automaticamente, como informações
                        de log, cookies e dados de uso da plataforma. Esses dados nos ajudam a entender como
                        você utiliza o <strong>ColabFlow</strong> e a melhorar nossos serviços.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>3. Uso das Informações</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Usamos suas informações para fornecer e melhorar nossos serviços, responder a
                        solicitações de suporte, enviar atualizações e notificações, e personalizar sua
                        experiência na plataforma. Também podemos usar suas informações para fins de análise
                        e pesquisa interna para aprimorar o <strong>ColabFlow</strong>.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>4. Compartilhamento de Informações</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Não compartilhamos suas informações pessoais com terceiros, exceto para cumprir
                        obrigações legais, proteger nossos direitos, ou se necessário para fornecer serviços
                        por meio de fornecedores e parceiros de confiança. Esses terceiros são obrigados a
                        proteger suas informações de acordo com nossas políticas.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>5. Segurança das Informações</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Implementamos medidas de segurança para proteger suas informações pessoais contra
                        acessos não autorizados, alterações, divulgações ou destruições. Usamos tecnologias
                        como criptografia e firewalls para proteger seus dados. No entanto, nenhum método de
                        transmissão ou armazenamento é completamente seguro, e não podemos garantir a
                        segurança absoluta dos seus dados.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>6. Retenção de Dados</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Retemos suas informações pessoais pelo tempo necessário para cumprir os propósitos
                        descritos nesta política, a menos que a lei exija um período de retenção mais longo.
                        Quando suas informações não forem mais necessárias, as excluiremos ou as tornaremos
                        anônimas.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>7. Direitos dos Usuários</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Também
                        pode optar por não receber comunicações de marketing a qualquer momento. Para exercer
                        esses direitos, entre em contato conosco através dos meios indicados no final desta
                        política.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>8. Cookies e Tecnologias Semelhantes</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Usamos cookies e tecnologias semelhantes para melhorar sua experiência no
                        <strong>ColabFlow</strong>, analisar o uso da plataforma e personalizar o conteúdo que
                        você vê. Você pode controlar o uso de cookies através das configurações do seu
                        navegador, mas algumas funcionalidades do <strong>ColabFlow</strong> podem ser afetadas
                        se você desativar os cookies.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>9. Alterações na Política de Privacidade</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças
                        em nossas práticas ou em leis aplicáveis. Notificaremos sobre mudanças significativas
                        por meio da nossa plataforma ou por e-mail antes que as mudanças entrem em vigor.
                    </p>

                    <h2 className='font-medium text-md mb-2 text-zinc-300'>10. Contato</h2>
                    <p className='font-light text-sm text-zinc-400 mb-5'>
                        Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade, entre em
                        contato conosco através do e-mail [email de contato].
                    </p>                  
                </div>
            </div>
        </div>
    )
}