import { db } from "@/api/base44Client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Star, Music, BookOpen, Gamepad2, Tv2, Info, Mail, LogOut, X, ShieldCheck } from "lucide-react";

const LOGO_URL = "/logo-pimpolhotv.png";

const navItems = [
  { label: "Início", icon: Home, path: "/", color: "text-purple-600" },
  { label: "Desenhos", icon: Star, path: "/category/desenhos", color: "text-pink-500" },
  { label: "Músicas", icon: Music, path: "/category/musicas", color: "text-blue-500" },
  { label: "Educativos", icon: BookOpen, path: "/category/educativos", color: "text-green-500" },
  { label: "Histórias", icon: BookOpen, path: "/category/historias", color: "text-yellow-500" },
  { label: "Jogos", icon: Gamepad2, path: "/category/jogos", color: "text-purple-500" },
];

export default function Sidebar({ open, onClose, user }) {
  const location = useLocation();

  const handleLogout = () => {
    onClose();
    db.auth.logout(window.location.origin);
  };

  const isActive = (path) => (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b-2 border-purple-100 shrink-0">
          <Link to="/" onClick={onClose} className="flex items-center gap-1">
            <img src={LOGO_URL} alt="Pimpolho TV" className="h-10 object-contain" style={{ maxWidth: "150px" }} />
          </Link>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${
                    isActive(item.path) ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-purple-50"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-3 border-t-2 border-purple-50" />

          <ul className="space-y-1 px-3">
            <li>
              <Link
                to={user ? "/my-channel" : "/login"}
                onClick={onClose}
                className="flex items-center gap-4 px-3 py-3 rounded-xl font-bold text-sm text-pink-600 hover:bg-pink-50 transition-colors"
              >
                <Tv2 className="w-5 h-5" />
                {user ? "Meu Canal" : "Criar Canal"}
              </Link>
            </li>
            {user?.role === "admin" && (
              <li>
                <Link
                  to="/admin"
                  onClick={onClose}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl font-bold text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Admin
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/about"
                onClick={onClose}
                className="flex items-center gap-4 px-3 py-3 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Info className="w-5 h-5" />
                Quem Somos
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={onClose}
                className="flex items-center gap-4 px-3 py-3 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        {user && (
          <div className="px-3 py-3 border-t-2 border-purple-100 shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-3 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
