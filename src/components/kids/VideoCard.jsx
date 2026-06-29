import React from "react";
import { Link } from "react-router-dom";
import { Play, Eye, Clock } from "lucide-react";
import { motion } from "framer-motion";

const categoryColors = {
  desenhos: "from-pink-400 to-rose-500",
  musicas: "from-blue-400 to-cyan-500",
  educativos: "from-green-400 to-emerald-500",
  historias: "from-yellow-400 to-orange-500",
  jogos: "from-purple-400 to-violet-500",
};

const categoryLabels = {
  desenhos: "🎨 Desenhos",
  musicas: "🎵 Músicas",
  educativos: "📚 Educativos",
  historias: "📖 Histórias",
  jogos: "🎮 Jogos",
};

const ageLabels = {
  "0-3": "👶 0-3 anos",
  "4-6": "🧒 4-6 anos",
  "7-9": "👦 7-9 anos",
  "10-12": "🧑 10-12 anos",
};

export default function VideoCard({ video, index = 0 }) {
  const gradientClass = categoryColors[video.category] || "from-purple-400 to-pink-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/watch/${video.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                <span className="text-5xl">
                  {video.category === "desenhos" && "🎨"}
                  {video.category === "musicas" && "🎵"}
                  {video.category === "educativos" && "📚"}
                  {video.category === "historias" && "📖"}
                  {video.category === "jogos" && "🎮"}
                </span>
              </div>
            )}

            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                <Play className="w-7 h-7 text-purple-600 ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Duration badge */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {video.duration}
              </div>
            )}

            {/* Category badge */}
            <div className={`absolute top-2 left-2 bg-gradient-to-r ${gradientClass} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
              {categoryLabels[video.category] || video.category}
            </div>
          </div>

          {/* Info */}
          <div className="bg-white p-3">
            <h3 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {video.title}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {(video.views || 0).toLocaleString()}
              </span>
              <span className="text-xs text-purple-500 font-semibold">
                {ageLabels[video.age_group] || video.age_group}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}