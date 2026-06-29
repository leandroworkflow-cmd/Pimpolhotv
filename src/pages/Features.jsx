import React from "react";
import Navbar from "@/components/kids/Navbar";
import Footer from "@/components/kids/Footer";
import SEOHead from "@/components/kids/SEOHead";
import { Shield, Star, Upload, Search, Tv2, Heart, Zap, Lock } from "lucide-react";

const features = [
  { icon: Shield, color: "bg-purple-100 text-purple-600", title: "Conteúdo 100% Seguro", desc: "Todo vídeo passa por verificação de inteligência artificial antes de ser publicado, garantindo que é adequado para crianças de 0 a 12 anos." },
  { icon: Star, color: "bg-yellow-100 text-yellow-600", title: "Curadoria de Qualidade", desc: "Selecionamos os melhores desenhos, músicas, histórias e vídeos educativos para estimular a criatividade e o aprendizado." },
  { icon: Upload, color: "bg-blue-100 text-blue-600", title: "Canal para Criadores", desc: "Criadores de conteúdo infantil podem criar seu próprio canal e publicar vídeos para a nossa comunidade crescente." },
  { icon: Search, color: "bg-green-100 text-green-600", title: "Busca Inteligente", desc: "Encontre facilmente vídeos por título, categoria ou faixa etária. Nossa busca é rápida e intuitiva." },
  { icon: Tv2, color: "bg-pink-100 text-pink-600", title: "Player Nativo", desc: "Player de vídeo otimizado para crianças, com tela cheia, sem anúncios invasivos e totalmente responsivo em qualquer dispositivo." },
  { icon: Heart, color: "bg-red-100 text-red-600", title: "Curtidas & Comentários", desc: "As crianças podem curtir os vídeos favoritos e deixar comentários supervisionados para interagir com a comunidade." },
  { icon: Zap, color: "bg-orange-100 text-orange-600", title: "Rápido e Responsivo", desc: "A plataforma foi desenvolvida para funcionar perfeitamente em celulares, tablets e computadores sem travar." },
  { icon: Lock, color: "bg-indigo-100 text-indigo-600", title: "Painel dos Pais", desc: "Pais e responsáveis têm acesso a um painel exclusivo para gerenciar conteúdo, canais e monitorar a plataforma." },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead title="Recursos" description="Conheça todos os recursos da Pimpolho TV — plataforma de vídeos segura para crianças." />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <span className="text-6xl block mb-4">🎯</span>
          <h1 className="text-4xl font-black text-gray-800 mb-3">Nossos Recursos</h1>
          <p className="text-lg text-gray-600 font-semibold max-w-2xl mx-auto">
            A Pimpolho TV foi construída pensando em segurança, diversão e qualidade para toda a família.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-black text-gray-800 text-base mb-2">{f.title}</h3>
              <p className="text-gray-600 font-semibold text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl font-black mb-3">Pronto para explorar? 🚀</h2>
          <p className="text-white/90 font-semibold mb-5">Acesse gratuitamente e descubra um mundo de diversão segura para as crianças!</p>
          <a href="/" className="inline-block px-8 py-3 bg-white text-purple-700 font-black rounded-full hover:bg-purple-50 transition-colors text-base">
            🏠 Ir para a Home
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}