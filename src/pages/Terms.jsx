import React from "react";
import Navbar from "@/components/kids/Navbar";
import Footer from "@/components/kids/Footer";
import SEOHead from "@/components/kids/SEOHead";

const sections = [
  { title: "1. Aceitação dos Termos", content: "Ao acessar e usar a Pimpolho TV, você concorda com estes Termos de Uso. Se não concordar com algum dos termos, solicitamos que não utilize a plataforma. O uso contínuo após alterações nos termos constitui aceitação das mudanças." },
  { title: "2. Descrição do Serviço", content: "A Pimpolho TV é uma plataforma gratuita de streaming de vídeos infantis, que permite assistir conteúdo curado e, mediante cadastro, publicar vídeos através de canais criados por usuários. O serviço é destinado a crianças de 0 a 12 anos sob supervisão dos pais ou responsáveis." },
  { title: "3. Cadastro e Contas", content: "Para criar um canal de conteúdo, é necessário cadastro com e-mail válido. Você é responsável pela confidencialidade da sua senha e por todas as atividades realizadas na sua conta. Pessoas menores de 18 anos devem ter autorização dos pais ou responsáveis para criar uma conta." },
  { title: "4. Conteúdo dos Usuários", content: "Ao publicar vídeos na plataforma, você: (a) confirma ser o titular ou ter autorização sobre os direitos do conteúdo; (b) garante que o conteúdo é adequado para crianças de 0 a 12 anos; (c) concede à Pimpolho TV licença não exclusiva para exibir o conteúdo na plataforma; (d) concorda com a análise de segurança por IA antes da publicação." },
  { title: "5. Conteúdo Proibido", content: "É estritamente proibido publicar conteúdo que contenha: violência, linguagem imprópria ou sexualidade; discriminação racial, religiosa ou de qualquer natureza; informações falsas ou enganosas; spam, publicidade abusiva ou conteúdo de phishing; qualquer material ilegal ou que viole direitos de terceiros." },
  { title: "6. Direitos de Propriedade Intelectual", content: "A marca Pimpolho TV, o design da plataforma e os conteúdos produzidos por nossa equipe são de propriedade da Pimpolho TV. O conteúdo publicado pelos criadores permanece de propriedade dos respectivos autores. Respeite os direitos autorais ao publicar vídeos na plataforma." },
  { title: "7. Moderação e Remoção de Conteúdo", content: "Reservamo-nos o direito de remover qualquer conteúdo que viole estes termos, sem aviso prévio. Contas reincidentes podem ser suspensas ou banidas permanentemente. Decisões de moderação podem ser contestadas pelo e-mail contato@cloudx.com.br." },
  { title: "8. Limitação de Responsabilidade", content: "A Pimpolho TV não se responsabiliza por: interrupções temporárias do serviço; conteúdo publicado por criadores de canal (que é de responsabilidade exclusiva do autor); danos indiretos decorrentes do uso da plataforma; links externos acessados a partir da plataforma." },
  { title: "9. Alterações nos Termos", content: "Podemos alterar estes Termos de Uso a qualquer momento. Usuários cadastrados serão notificados por e-mail sobre mudanças relevantes. A data da última atualização sempre estará indicada no topo desta página." },
  { title: "10. Legislação Aplicável", content: "Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer conflitos decorrentes destes termos." },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead title="Termos de Uso" description="Termos de Uso da Pimpolho TV." />
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <span className="text-5xl block mb-4">📋</span>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Termos de Uso</h1>
          <p className="text-gray-500 text-sm font-semibold">Última atualização: Junho de 2026</p>
        </div>

        <div className="bg-yellow-50 rounded-2xl p-5 mb-8 border border-yellow-200">
          <p className="text-sm font-semibold text-yellow-800 leading-relaxed">
            ⚠️ Leia atentamente estes termos antes de usar a Pimpolho TV. Ao acessar a plataforma, você concorda com todas as condições descritas abaixo.
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