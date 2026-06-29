const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";

import Navbar from "@/components/kids/Navbar";
import FeaturedCarousel from "@/components/kids/FeaturedCarousel";
import CategoryBanner from "@/components/kids/CategoryBanner";
import VideoGrid from "@/components/kids/VideoGrid";
import { Loader2 } from "lucide-react";
import SEOHead from "@/components/kids/SEOHead";
import TopVideos from "@/components/kids/TopVideos";
import AdBanner from "@/components/kids/AdBanner";
import Footer from "@/components/kids/Footer";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await db.entities.Video.filter({ status: "active" }, "-created_date", 50);
        setVideos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featured = videos.filter((v) => v.featured);
  const desenhos = videos.filter((v) => v.category === "desenhos");
  const musicas = videos.filter((v) => v.category === "musicas");
  const educativos = videos.filter((v) => v.category === "educativos");
  const historias = videos.filter((v) => v.category === "historias");
  const jogos = videos.filter((v) => v.category === "jogos");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-bold text-purple-600">Carregando diversão... 🎉</p>
                </div>
              </div>
            ) : (
              <>
                {featured.length > 0 && <FeaturedCarousel videos={featured} />}
                <AdBanner type="horizontal" className="my-2" />
                {videos.length > 0 && <TopVideos videos={videos} />}
                <section>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                    🌈 Categorias
                  </h2>
                  <CategoryBanner />
                </section>
                {desenhos.length > 0 && <VideoGrid videos={desenhos} title="Desenhos Animados" emoji="🎨" />}
                <AdBanner type="square" className="my-2" />
                {musicas.length > 0 && <VideoGrid videos={musicas} title="Músicas Infantis" emoji="🎵" />}
                {educativos.length > 0 && <VideoGrid videos={educativos} title="Vídeos Educativos" emoji="📚" />}
                {historias.length > 0 && <VideoGrid videos={historias} title="Histórias Encantadas" emoji="📖" />}
                {jogos.length > 0 && <VideoGrid videos={jogos} title="Jogos & Diversão" emoji="🎮" />}
                {videos.length === 0 && (
                  <div className="text-center py-20">
                    <span className="text-7xl block mb-4">🎬</span>
                    <h2 className="text-2xl font-black text-gray-700 mb-2">Nenhum vídeo ainda!</h2>
                    <p className="text-gray-500 font-semibold">
                      Acesse o <a href="/admin" className="text-purple-600 underline">Painel dos Pais</a> para adicionar vídeos.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar lateral direita — Ad vertical (só desktop) */}
          <div className="hidden xl:block w-44 shrink-0 sticky top-20">
            <AdBanner type="vertical" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}