import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedCarousel({ videos }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (videos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [videos.length]);

  if (!videos.length) return null;

  const video = videos[current];

  const gradients = [
    "from-purple-600 via-pink-500 to-orange-400",
    "from-blue-600 via-cyan-500 to-green-400",
    "from-pink-600 via-rose-500 to-yellow-400",
    "from-indigo-600 via-purple-500 to-pink-400",
  ];
  const gradient = gradients[current % gradients.length];

  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r ${gradient} p-4 sm:p-8 md:p-12`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-8 text-6xl">⭐</div>
        <div className="absolute bottom-6 right-12 text-5xl">🌈</div>
        <div className="absolute top-1/2 left-1/3 text-4xl">✨</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={video.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          {/* Thumbnail */}
          <div className="w-full sm:w-1/2 aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-black/20">
            {video.thumbnail_url ? (
              <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">🎬</div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-white text-center sm:text-left">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3">
              ⭐ Em Destaque
            </span>
            <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 drop-shadow-lg">
              {video.title}
            </h2>
            {video.description && (
              <p className="text-white/80 text-sm mb-4 line-clamp-2">{video.description}</p>
            )}
            <Link
              to={`/watch/${video.id}`}
              className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors shadow-lg"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Assistir Agora
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      {videos.length > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + videos.length) % videos.length)}
            className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? "bg-white w-6" : "bg-white/40"
              }`}
            />
          ))}
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % videos.length)}
            className="p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}