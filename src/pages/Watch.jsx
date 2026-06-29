const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "@/components/kids/Navbar";
import VideoCard from "@/components/kids/VideoCard";
import CommentsSection from "@/components/kids/CommentsSection";
import { Loader2, ArrowLeft, Heart, Share2, Clock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "@/components/kids/SEOHead";
import AdBanner from "@/components/kids/AdBanner";
import ShareButtons from "@/components/kids/ShareButtons";

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

function getSessionId() {
  let id = localStorage.getItem("kids_session_id");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("kids_session_id", id);
  }
  return id;
}

function isYouTube(url) {
  return url && (url.includes("youtube.com") || url.includes("youtu.be"));
}

function getYouTubeEmbed(url) {
  if (!url) return null;
  // already an embed URL — extract clean video ID
  let match = url.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  // youtu.be/VIDEO_ID
  match = url.match(/youtu\.be\/([^?&/]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  // youtube.com/shorts/VIDEO_ID
  match = url.match(/youtube\.com\/shorts\/([^?&/]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  // youtube.com/watch?v=VIDEO_ID
  match = url.match(/youtube\.com\/watch\?.*v=([^&/]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return null;
}

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const sessionId = getSessionId();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const v = await db.entities.Video.get(id);
        setVideo(v);
        await db.entities.Video.update(id, { views: (v.views || 0) + 1 });

        const all = await db.entities.Video.filter({ status: "active", category: v.category }, "-created_date", 8);
        setRelated(all.filter((r) => r.id !== id));

        // Load likes
        const likes = await db.entities.Like.filter({ video_id: id });
        setLikeCount(likes.length);
        const myLike = likes.find((l) => l.session_id === sessionId);
        setLiked(!!myLike);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (liked) {
        const likes = await db.entities.Like.filter({ video_id: id, session_id: sessionId });
        if (likes[0]) await db.entities.Like.delete(likes[0].id);
        setLiked(false);
        setLikeCount((c) => c - 1);
      } else {
        await db.entities.Like.create({ video_id: id, session_id: sessionId });
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
        <SEOHead />
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
        <SEOHead title="Vídeo não encontrado" />
        <Navbar />
        <div className="text-center py-32">
          <span className="text-6xl block mb-4">😢</span>
          <h2 className="text-2xl font-black text-gray-700">Vídeo não encontrado</h2>
          <Link to="/" className="mt-4 inline-block text-purple-600 font-bold underline">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  const embedUrl = isYouTube(video.video_url) ? getYouTubeEmbed(video.video_url) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead
        title={video.title}
        description={video.description}
        image={video.thumbnail_url}
        type="video.other"
        videoUrl={video.video_url}
      />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-purple-600 font-bold text-sm mb-4 hover:text-purple-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              {/* Video player */}
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
                {embedUrl ? (
                  <iframe
                    src={`${embedUrl}?rel=0&modestbranding=1&playsinline=1`}
                    title={video.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : video.video_url ? (
                  <video
                    src={video.video_url}
                    controls
                    playsInline
                    className="w-full h-full"
                    poster={video.thumbnail_url || undefined}
                    controlsList="nodownload"
                  >
                    <source src={video.video_url} />
                    Seu navegador não suporta reprodução de vídeo.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                    Vídeo indisponível
                  </div>
                )}
              </div>

              {/* Video info */}
              <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl font-black text-gray-800">{video.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                        {categoryLabels[video.category]}
                      </span>
                      <span className="text-sm font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                        {ageLabels[video.age_group]}
                      </span>
                      {video.duration && (
                        <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {video.duration}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {((video.views || 0) + 1).toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                      liked
                        ? "bg-red-500 text-white shadow-lg scale-105"
                        : "bg-red-50 text-red-500 hover:bg-red-100"
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
                    {likeCount > 0 ? likeCount : ""} {liked ? "Curtido!" : "Curtir"}
                  </button>
                  <ShareButtons title={video.title} url={window.location.href} />
                </div>

                {/* Description */}
                {video.description && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-gray-700 font-semibold leading-relaxed">{video.description}</p>
                  </div>
                )}
              </div>

              {/* Comments */}
              <CommentsSection videoId={id} />
            </motion.div>
          </div>

          {/* Sidebar - related videos */}
          <div className="w-full xl:w-80 2xl:w-96">
            <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              ✨ Vídeos Relacionados
            </h3>
            {/* Mobile: horizontal scroll; Desktop: vertical list */}
            <div className="flex xl:flex-col gap-3 overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0">
              {related.map((v) => (
                <Link key={v.id} to={`/watch/${v.id}`} className="group flex xl:flex-row gap-3 bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-all border border-purple-50 hover:border-purple-200 shrink-0 w-56 xl:w-auto">
                  <div className="w-24 xl:w-32 aspect-video rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-purple-100 to-pink-100">
                    {v.thumbnail_url ? (
                      <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors">{v.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">{(v.views || 0).toLocaleString()} views</p>
                    {v.duration && <p className="text-xs text-gray-400 font-semibold">{v.duration}</p>}
                  </div>
                </Link>
              ))}
              {related.length === 0 && (
                <p className="text-sm text-gray-400 font-semibold text-center py-8 w-full">Nenhum vídeo relacionado</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}