import React, { useState } from "react";
import Navbar from "@/components/kids/Navbar";
import Footer from "@/components/kids/Footer";
import SEOHead from "@/components/kids/SEOHead";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  { q: "A Pimpolho TV é gratuita?", a: "Sim! A Pimpolho TV é completamente gratuita para assistir. Qualquer criança pode acessar todos os vídeos sem pagar nada." },
  { q: "Preciso criar uma conta para assistir os vídeos?", a: "Não! Você pode assistir todos os vídeos sem criar conta. A conta só é necessária se quiser criar seu próprio canal como criador de conteúdo." },
  { q: "Como os vídeos são verificados?", a: "Todos os vídeos passam por uma análise de Inteligência Artificial que verifica se o conteúdo é seguro e adequado para crianças de 0 a 12 anos. Vídeos reprovados não são publicados." },
  { q: "Posso criar um canal para publicar vídeos infantis?", a: "Sim! Basta criar uma conta gratuita, acessar 'Meu Canal' e começar a publicar seu conteúdo. Todos os vídeos passam pela nossa curadoria de segurança antes de aparecer no site." },
  { q: "Os vídeos têm anúncios para crianças?", a: "Trabalhamos para manter a experiência das crianças o mais tranquila possível. Qualquer publicidade presente segue as diretrizes do Código de Defesa do Consumidor e respeita o público infantil." },
  { q: "Posso denunciar um vídeo inadequado?", a: "Sim! Entre em contato conosco pelo formulário de contato informando o título do vídeo. Nossa equipe analisa e toma as medidas necessárias em até 24 horas." },
  { q: "Como funciona o sistema de faixa etária?", a: "Cada vídeo é classificado por faixa etária: 0-3 anos, 4-6 anos, 7-9 anos ou 10-12 anos. Você pode filtrar por categoria para encontrar conteúdo adequado para a idade da criança." },
  { q: "A plataforma funciona no celular?", a: "Sim! A Pimpolho TV é totalmente responsiva e funciona perfeitamente em celulares, tablets e computadores." },
  { q: "Como entro em contato com o suporte?", a: "Acesse nossa página de Contato e preencha o formulário. Respondemos em até 48 horas úteis pelo e-mail informado." },
  { q: "Como removo meu canal ou conta?", a: "Entre em contato conosco pelo e-mail contato@cloudx.com.br solicitando a exclusão da sua conta e iremos processar em até 5 dias úteis." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-purple-50 transition-colors"
      >
        <span className="font-black text-gray-800 text-sm pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-purple-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-purple-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 font-semibold leading-relaxed border-t border-purple-50 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead title="FAQ" description="Perguntas frequentes sobre a Pimpolho TV." />
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <span className="text-6xl block mb-4">❓</span>
          <h1 className="text-4xl font-black text-gray-800 mb-2">Perguntas Frequentes</h1>
          <p className="text-gray-600 font-semibold">Tudo o que você precisa saber sobre a Pimpolho TV</p>
        </div>

        <div className="space-y-3 mb-10">
          {faqs.map((faq) => <FAQItem key={faq.q} {...faq} />)}
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white text-center">
          <p className="font-black text-lg mb-1">Não encontrou sua resposta?</p>
          <p className="text-white/80 text-sm font-semibold mb-4">Fale diretamente com nossa equipe!</p>
          <a href="/contact" className="inline-block px-6 py-2 bg-white text-purple-700 font-black rounded-full hover:bg-purple-50 transition-colors">
            💌 Entrar em Contato
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}