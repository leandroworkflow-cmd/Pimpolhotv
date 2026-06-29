import React from "react";
import Navbar from "@/components/kids/Navbar";
import SEOHead from "@/components/kids/SEOHead";
import { Link } from "react-router-dom";
import Footer from "@/components/kids/Footer";
import { Shield, Star, Heart, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead title="Quem Somos" description="Conheça a Pimpolho TV — plataforma de vídeos segura e divertida para crianças!" />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="text-7xl block mb-4">🌟</span>
          <h1 className="text-4xl font-black text-gray-800 mb-3">Quem Somos</h1>
          <p className="text-lg text-gray-600 font-semibold max-w-2xl mx-auto">
            Somos a <span className="text-purple-600">Pimpolho TV</span> — um espaço 100% seguro, colorido e cheio de alegria criado especialmente para crianças de 0 a 12 anos!
          </p>
        </div>

        {/* Mission cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Shield, color: "bg-purple-100 text-purple-600", title: "Segurança em Primeiro Lugar", desc: "Todo conteúdo é verificado por inteligência artificial e revisado por nosso time para garantir que é 100% adequado para crianças." },
            { icon: Star, color: "bg-yellow-100 text-yellow-600", title: "Conteúdo de Qualidade", desc: "Selecionamos cuidadosamente desenhos, músicas, histórias e vídeos educativos que estimulam a criatividade e o aprendizado." },
            { icon: Heart, color: "bg-pink-100 text-pink-600", title: "Feito com Amor", desc: "Cada detalhe da plataforma foi pensado para proporcionar a melhor experiência para as crianças e tranquilidade para os pais." },
            { icon: Users, color: "bg-green-100 text-green-600", title: "Comunidade Familiar", desc: "Permitimos que criadores de conteúdo infantil responsáveis publiquem seus vídeos e cresçam junto com nossa comunidade." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-black text-gray-800 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 font-semibold text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white text-center mb-10">
          <h2 className="text-2xl font-black mb-3">Nossa História 📖</h2>
          <p className="font-semibold leading-relaxed max-w-2xl mx-auto text-white/90">
            A Pimpolho TV nasceu da vontade de criar um ambiente digital verdadeiramente seguro para as crianças. 
            Em um mundo repleto de conteúdos inadequados, decidimos construir uma plataforma onde pais podem 
            confiar e crianças podem se divertir livremente, aprendendo e explorando com alegria!
          </p>
        </div>

        <div className="text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-black rounded-full hover:bg-purple-700 transition-colors text-lg">
            💌 Entre em Contato
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}