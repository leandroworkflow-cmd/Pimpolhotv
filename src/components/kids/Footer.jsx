import { db } from "@/api/base44Client";

import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

const LOGO_URL = "/logo-pimpolhotv.png";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo & descrição */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={LOGO_URL} alt="Pimpolho TV" className="h-14 object-contain mb-3" />
            <p className="text-white/80 text-sm font-semibold leading-relaxed">
              Um espaço 100% seguro, colorido e divertido para crianças de 0 a 12 anos explorarem desenhos, músicas, histórias e muito mais!
            </p>
            <div className="flex items-center gap-2 mt-4 text-white/70 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 text-pink-300" /> Feito com amor para as crianças
            </div>
          </div>

          {/* Páginas */}
          <div>
            <h4 className="font-black text-base mb-4 text-white">Navegação</h4>
            <ul className="space-y-2">
              {[
                { label: "🏠 Home", path: "/" },
                { label: "🌟 Quem Somos", path: "/about" },
                { label: "🎯 Recursos", path: "/features" },
                { label: "💌 Contato", path: "/contact" },
                { label: "❓ FAQ", path: "/faq" },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-white/80 hover:text-white text-sm font-semibold transition-colors hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-black text-base mb-4 text-white">Categorias</h4>
            <ul className="space-y-2">
              {[
                { label: "🎨 Desenhos", path: "/category/desenhos" },
                { label: "🎵 Músicas", path: "/category/musicas" },
                { label: "📚 Educativos", path: "/category/educativos" },
                { label: "📖 Histórias", path: "/category/historias" },
                { label: "🎮 Jogos", path: "/category/jogos" },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-white/80 hover:text-white text-sm font-semibold transition-colors hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-black text-base mb-4 text-white">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                <Mail className="w-4 h-4 text-pink-300 shrink-0" />
                contato@cloudx.com.br
              </li>
              <li className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                <Phone className="w-4 h-4 text-pink-300 shrink-0" />
                (31) 98373-3004
              </li>
              <li className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                <MapPin className="w-4 h-4 text-pink-300 shrink-0" />
                São Paulo, SP — Brasil
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/60 text-xs font-semibold text-center sm:text-left">
            © {new Date().getFullYear()} Pimpolho TV. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-white/60 hover:text-white text-xs font-semibold transition-colors hover:underline">
              Política de Privacidade
            </Link>
            <span className="text-white/30">|</span>
            <Link to="/terms" className="text-white/60 hover:text-white text-xs font-semibold transition-colors hover:underline">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}