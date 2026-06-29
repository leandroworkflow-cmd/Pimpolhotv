import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { id: "desenhos", label: "Desenhos", emoji: "🎨", gradient: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
  { id: "musicas", label: "Músicas", emoji: "🎵", gradient: "from-blue-400 to-cyan-500", bg: "bg-blue-50" },
  { id: "educativos", label: "Educativos", emoji: "📚", gradient: "from-green-400 to-emerald-500", bg: "bg-green-50" },
  { id: "historias", label: "Histórias", emoji: "📖", gradient: "from-yellow-400 to-orange-500", bg: "bg-yellow-50" },
  { id: "jogos", label: "Jogos", emoji: "🎮", gradient: "from-purple-400 to-violet-500", bg: "bg-purple-50" },
];

export default function CategoryBanner() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
        >
          <Link
            to={`/category/${cat.id}`}
            className={`block ${cat.bg} rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-purple-200`}
          >
            <span className="text-3xl sm:text-4xl block mb-1 sm:mb-2">{cat.emoji}</span>
            <span className="text-xs sm:text-sm font-extrabold text-gray-700">{cat.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}