import { db } from "@/api/base44Client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Home, Star, Music, BookOpen, Gamepad2, Menu, X, Tv2, Info, Mail } from "lucide-react";

const LOGO_URL = "/logo-pimpolhotv.png";

const categories = [
  { label: "Início", icon: Home, path: "/" },
  { label: "Desenhos", icon: Star, path: "/category/desenhos", color: "text-pink-500" },
  { label: "Músicas", icon: Music, path: "/category/musicas", color: "text-blue-500" },
  { label: "Educativos", icon: BookOpen, path: "/category/educativos", color: "text-green-500" },
  { label: "Histórias", icon: BookOpen, path: "/category/historias", color: "text-yellow-500" },
  { label: "Jogos", icon: Gamepad2, path: "/category/jogos", color: "text-purple-500" },
];

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-4 border-purple-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <img src={LOGO_URL} alt="Pimpolho TV" className="h-12 object-contain" style={{ maxWidth: "180px" }} />
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="O que você quer assistir? 🔍"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-purple-50 border-2 border-purple-200 focus:border-purple-400 focus:bg-white transition-all text-sm font-semibold placeholder:text-purple-300 outline-none"
              />
            </div>
          </form>

          {/* Desktop categories */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.slice(1).map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-purple-50 transition-colors ${cat.color}`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </Link>
            ))}
          </div>

          {/* My Channel / Admin links */}
          <div className="hidden md:flex items-center gap-2 ml-3">
            <Link to="/about" className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-purple-600 transition-colors">
              <Info className="w-3.5 h-3.5" /> Quem Somos
            </Link>
            <Link to="/contact" className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-pink-600 transition-colors">
              <Mail className="w-3.5 h-3.5" /> Contato
            </Link>
            {user && (
              <Link to="/my-channel" className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-pink-600 bg-pink-100 rounded-full hover:bg-pink-200 transition-colors">
                <Tv2 className="w-3.5 h-3.5" /> Meu Canal
              </Link>
            )}
            {!user && (
              <Link to="/login" className="px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors">
                Criar Canal
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
                🛡️ Admin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-purple-600 hover:bg-purple-50"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t-2 border-purple-100 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar vídeos..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-purple-50 border-2 border-purple-200 focus:border-purple-400 text-sm font-semibold outline-none"
              />
            </div>
          </form>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <cat.icon className={`w-6 h-6 ${cat.color || "text-purple-600"}`} />
                <span className="text-xs font-bold text-gray-700">{cat.label}</span>
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Link to="/about" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-full">
                <Info className="w-4 h-4" /> Quem Somos
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-full">
                <Mail className="w-4 h-4" /> Contato
              </Link>
            </div>
            {user ? (
              <Link to="/my-channel" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 py-2 text-sm font-bold text-pink-600 bg-pink-100 rounded-full">
                <Tv2 className="w-4 h-4" /> Meu Canal
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center py-2 text-sm font-bold text-purple-600 bg-purple-100 rounded-full">
                Criar Canal
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-center py-2 text-sm font-bold text-white bg-purple-600 rounded-full">
                🛡️ Painel Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}