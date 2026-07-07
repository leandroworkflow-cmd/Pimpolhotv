import { db } from "@/api/base44Client";

import React, { useState, useEffect } from "react";

import Navbar from "@/components/kids/Navbar";
import VideoGrid from "@/components/kids/VideoGrid";
import AdBanner from "@/components/kids/AdBanner";
import { Loader2, Search } from "lucide-react";
import SEOHead from "@/components/kids/SEOHead";

export default function SearchResults() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await db.entities.Video.filter({ status: "active" }, "-created_date", 100);
        const q = query.toLowerCase();
        const filtered = all.filter(
          (v) =>
            v.title?.toLowerCase().includes(q) ||
            v.description?.toLowerCase().includes(q) ||
            v.category?.toLowerCase().includes(q)
        );
        setVideos(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (query) load();
    else setLoading(false);
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead title={`Busca: ${query}`} description={`Resultados para "${query}" na KidsTV - vídeos infantis seguros.`} />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-purple-500" />
          <h1 className="text-xl sm:text-2xl font-black text-gray-800">
            Resultados para: <span className="text-purple-600">"{query}"</span>
          </h1>
        </div>

        <AdBanner type="horizontal" />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : videos.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 font-semibold">
              {videos.length} vídeo{videos.length !== 1 ? "s" : ""} encontrado{videos.length !== 1 ? "s" : ""}
            </p>
            <VideoGrid videos={videos} />
          </>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🔍</span>
            <h2 className="text-xl font-black text-gray-700">Nenhum resultado encontrado</h2>
            <p className="text-gray-500 font-semibold mt-2">Tente buscar com outras palavras!</p>
          </div>
        )}
      </main>
    </div>
  );
}