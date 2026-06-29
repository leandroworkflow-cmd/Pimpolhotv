import React from "react";
import Navbar from "@/components/kids/Navbar";
import Footer from "@/components/kids/Footer";
import SEOHead from "@/components/kids/SEOHead";

const sections = [
  { title: "1. Informações que Coletamos", content: "Coletamos apenas as informações estritamente necessárias para o funcionamento da plataforma. Para usuários visitantes (sem conta), não coletamos dados pessoais. Para criadores de canal, coletamos nome e e-mail fornecidos no cadastro. Utilizamos cookies técnicos para manter sessões ativas e preferências de navegação." },
  { title: "2. Como Usamos as Informações", content: "As informações coletadas são usadas exclusivamente para: (a) gerenciar sua conta de criador de conteúdo; (b) enviar comunicações relacionadas à plataforma; (c) garantir a segurança e funcionamento do serviço. Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais." },
  { title: "3. Proteção de Crianças (LGPD e COPPA)", content: "A Pimpolho TV é destinada ao uso supervisionado por crianças. Não coletamos intencionalmente dados pessoais de crianças menores de 13 anos. Comentários são anônimos e identificados apenas por apelido escolhido pelo usuário. Pais ou responsáveis que acreditam que seus filhos forneceram dados podem nos contatar para exclusão imediata." },
  { title: "4. Cookies e Tecnologias de Rastreamento", content: "Utilizamos cookies técnicos essenciais para o funcionamento da plataforma. Podemos utilizar cookies de terceiros para exibição de anúncios (Google AdSense), que seguem as políticas de privacidade do Google. Você pode desativar cookies no seu navegador, o que pode afetar algumas funcionalidades." },
  { title: "5. Segurança dos Dados", content: "Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Nossa plataforma utiliza conexões seguras (HTTPS) em todas as comunicações." },
  { title: "6. Seus Direitos (LGPD)", content: "Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018), você tem direito a: acessar seus dados, corrigir dados incorretos, solicitar a exclusão dos seus dados, revogar consentimento a qualquer momento. Para exercer esses direitos, entre em contato pelo e-mail: privacidade@pimpolhotv.com.br" },
  { title: "7. Alterações nesta Política", content: "Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos usuários cadastrados sobre mudanças significativas por e-mail. O uso continuado da plataforma após as alterações constitui aceitação da nova política." },
  { title: "8. Contato", content: "Dúvidas sobre esta política? Entre em contato: privacidade@pimpolhotv.com.br ou pelo formulário na página de Contato." },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead title="Política de Privacidade" description="Política de privacidade da Pimpolho TV." />
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <span className="text-5xl block mb-4">🔐</span>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Política de Privacidade</h1>
          <p className="text-gray-500 text-sm font-semibold">Última atualização: Junho de 2026</p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-5 mb-8 border border-purple-100">
          <p className="text-sm font-semibold text-purple-800 leading-relaxed">
            A Pimpolho TV está comprometida com a privacidade e segurança dos seus usuários, especialmente das crianças. Esta política descreve como tratamos as informações coletadas em nossa plataforma.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-gray-800 text-base mb-3">{s.title}</h2>
              <p className="text-gray-600 text-sm font-semibold leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}