import { db } from "@/api/base44Client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Navbar from "@/components/kids/Navbar";
import VideoGrid from "@/components/kids/VideoGrid";
import AdBanner from "@/components/kids/AdBanner";
import { Loader2 } from "lucide-react";
import SEOHead from "@/components/kids/SEOHead";

const categoryConfig = {
  desenhos: { label: "Desenhos Animados", emoji: "🎨", gradient: "from-pink-400 to-rose-500" },
  musicas: { label: "Músicas Infantis", emoji: "🎵", gradient: "from-blue-400 to-cyan-500" },
  educativos: { label: "Vídeos Educativos", emoji: "📚", gradient: "from-green-400 to-emerald-500" },
  historias: { label: "Histórias Encantadas", emoji: "📖", gradient: "from-yellow-400 to-orange-500" },
  jogos: { label: "Jogos & Diversão", emoji: "🎮", gradient: "from-purple-400 to-violet-500" },
};

const ageGroups = [
  { value: "", label: "Todas as Idades 🌈" },
  { value: "0-3", label: "👶 0-3 anos" },
  { value: "4-6", label: "🧒 4-6 anos" },
  { value: "7-9", label: "👦 7-9 anos" },
  { value: "10-12", label: "🧑 10-12 anos" },
];

export default function Category() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ageFilter, setAgeFilter] = useState("");

  const config = categoryConfig[slug] || { label: slug, emoji: "📺", gradient: "from-purple-400 to-pink-500" };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const filter = { status: "active", category: slug };
        if (ageFilter) filter.age_group = ageFilter;
        const data = await db.entities.Video.filter(filter, "-created_date", 50);
        setVideos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, ageFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead title={config.label} description={`Assista aos melhores ${config.label} para crianças até 12 anos! Conteúdo 100% seguro e divertido.`} />
      <Navbar />

      {/* Hero banner */}
      <div className={`bg-gradient-to-r ${config.gradient} py-8 sm:py-12 px-4`}>
        <div className="max-w-7xl mx-auto text-center text-white">
          <span className="text-5xl block mb-3">{config.emoji}</span>
          <h1 className="text-3xl sm:text-4xl font-black drop-shadow-lg">{config.label}</h1>
          <p className="mt-2 text-white/80 font-semibold">
            {videos.length} vídeo{videos.length !== 1 ? "s" : ""} disponíve{videos.length !== 1 ? "is" : "l"}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Age filter */}
        <div className="flex flex-wrap gap-2">
          {ageGroups.map((ag) => (
            <button
              key={ag.value}
              onClick={() => setAgeFilter(ag.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                ageFilter === ag.value
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-purple-50 border border-purple-200"
              }`}
            >
              {ag.label}
            </button>
          ))}
        </div>

        <AdBanner type="horizontal" />

        {/* Videos */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : videos.length > 0 ? (
          <VideoGrid videos={videos} />
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">😢</span>
            <h2 className="text-xl font-black text-gray-700">Nenhum vídeo encontrado</h2>
            <p className="text-gray-500 font-semibold mt-2">Tente outra faixa etária!</p>
          </div>
        )}
      </main>
    </div>
  );
}