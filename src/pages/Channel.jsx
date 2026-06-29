const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "@/components/kids/Navbar";
import VideoGrid from "@/components/kids/VideoGrid";
import { Loader2, Edit2, Plus } from "lucide-react";

export default function Channel() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [ch, user] = await Promise.all([
          db.entities.Channel.get(id),
          db.auth.me().catch(() => null),
        ]);
        setChannel(ch);
        setCurrentUser(user);
        const vids = await db.entities.Video.filter({ channel_id: id, status: "active" }, "-created_date", 50);
        setVideos(vids);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const isOwner = currentUser && channel && currentUser.id === channel.owner_id;

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Navbar />
      <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 text-purple-500 animate-spin" /></div>
    </div>
  );

  if (!channel) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Navbar />
      <div className="text-center py-32">
        <p className="text-2xl font-black text-gray-700">Canal não encontrado 😢</p>
        <Link to="/" className="text-purple-600 font-bold underline mt-4 inline-block">Voltar ao início</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <Navbar />

      {/* Banner */}
      <div className={`bg-gradient-to-r ${channel.banner_color || "from-purple-500 to-pink-500"} py-10 px-4`}>
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center text-4xl shadow-lg">
            {channel.avatar_emoji || "🎬"}
          </div>
          <div className="flex-1 text-white">
            <h1 className="text-2xl sm:text-3xl font-black drop-shadow">{channel.name}</h1>
            {channel.description && <p className="text-white/80 font-semibold mt-1 text-sm">{channel.description}</p>}
            <p className="text-white/70 text-xs mt-1 font-semibold">{videos.length} vídeo{videos.length !== 1 ? "s" : ""}</p>
          </div>
          {isOwner && (
            <Link
              to={`/my-channel`}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all"
            >
              <Edit2 className="w-4 h-4" /> Gerenciar
            </Link>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {videos.length > 0 ? (
          <VideoGrid videos={videos} />
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🎬</span>
            <p className="text-lg font-black text-gray-700">Nenhum vídeo ainda</p>
            {isOwner && (
              <Link to="/my-channel" className="mt-4 inline-flex items-center gap-2 bg-purple-600 text-white rounded-full px-5 py-2 font-bold text-sm hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4" /> Adicionar vídeo
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}