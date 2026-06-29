const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Eye, Heart, MessageSquare, Video, TrendingUp, Users, Star, ArrowLeft } from "lucide-react";
import Navbar from "@/components/kids/Navbar";

const COLORS = ["#a855f7", "#ec4899", "#3b82f6", "#22c55e", "#f59e0b"];

const categoryLabels = {
  desenhos: "Desenhos",
  musicas: "Músicas",
  educativos: "Educativos",
  historias: "Histórias",
  jogos: "Jogos",
};

export default function AdminDashboard() {
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [v, c, l, ch] = await Promise.all([
          db.entities.Video.list("-created_date", 200),
          db.entities.Comment.list("-created_date", 200),
          db.entities.Like.list("-created_date", 500),
          db.entities.Channel.list("-created_date", 100),
        ]);
        setVideos(v);
        setComments(c);
        setLikes(l);
        setChannels(ch);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!loading && user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">🔒</span>
        <h2 className="text-2xl font-black text-gray-700">Acesso Restrito</h2>
        <p className="text-gray-500 mt-2 font-semibold">Apenas administradores podem acessar esta área.</p>
        <Link to="/" className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  // Analytics
  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const activeVideos = videos.filter((v) => v.status === "active").length;
  const featuredVideos = videos.filter((v) => v.featured).length;

  // Views por categoria
  const viewsByCategory = Object.entries(categoryLabels).map(([key, label]) => ({
    name: label,
    views: videos.filter((v) => v.category === key).reduce((s, v) => s + (v.views || 0), 0),
    videos: videos.filter((v) => v.category === key).length,
  }));

  // Top 10 vídeos mais assistidos
  const topVideos = [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);

  // Likes por categoria
  const likesByCategory = Object.entries(categoryLabels).map(([key, label]) => {
    const videoIds = videos.filter((v) => v.category === key).map((v) => v.id);
    return { name: label, likes: likes.filter((l) => videoIds.includes(l.video_id)).length };
  });

  // Últimos comentários
  const recentComments = comments.slice(0, 8);

  // Videos por faixa etária
  const byAge = [
    { name: "0-3 anos", value: videos.filter((v) => v.age_group === "0-3").length },
    { name: "4-6 anos", value: videos.filter((v) => v.age_group === "4-6").length },
    { name: "7-9 anos", value: videos.filter((v) => v.age_group === "7-9").length },
    { name: "10-12 anos", value: videos.filter((v) => v.age_group === "10-12").length },
  ];

  const stats = [
    { label: "Total de Views", value: totalViews.toLocaleString(), icon: Eye, color: "bg-purple-100 text-purple-600" },
    { label: "Vídeos Ativos", value: activeVideos, icon: Video, color: "bg-blue-100 text-blue-600" },
    { label: "Total de Curtidas", value: likes.length, icon: Heart, color: "bg-pink-100 text-pink-600" },
    { label: "Comentários", value: comments.length, icon: MessageSquare, color: "bg-green-100 text-green-600" },
    { label: "Canais", value: channels.length, icon: Users, color: "bg-yellow-100 text-yellow-600" },
    { label: "Em Destaque", value: featuredVideos, icon: Star, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link to="/admin" className="inline-flex items-center gap-1 text-purple-600 font-bold text-sm hover:text-purple-800">
            <ArrowLeft className="w-4 h-4" /> Painel
          </Link>
          <div className="sm:ml-4">
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-purple-500" /> Dashboard Analítico
            </h1>
            <p className="text-sm text-gray-500 font-semibold">Visão geral da plataforma Pimpolho TV</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 text-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black text-gray-800">{s.value}</p>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Views por Categoria */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">📊 Views por Categoria</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={viewsByCategory}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => v.toLocaleString()} />
                    <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                      {viewsByCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Vídeos por Faixa Etária */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">👶 Vídeos por Faixa Etária</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={byAge} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {byAge.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Curtidas por Categoria */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">❤️ Curtidas por Categoria</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={likesByCategory} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} width={70} />
                    <Tooltip />
                    <Bar dataKey="likes" radius={[0, 6, 6, 0]}>
                      {likesByCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Comentários Recentes */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">💬 Comentários Recentes</h3>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {recentComments.length === 0 && (
                    <p className="text-gray-400 text-sm font-semibold text-center py-4">Nenhum comentário ainda</p>
                  )}
                  {recentComments.map((c) => (
                    <div key={c.id} className="flex gap-2 p-2 bg-purple-50 rounded-xl">
                      <span className="text-lg">💬</span>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-purple-700">{c.author_name}</p>
                        <p className="text-xs text-gray-600 truncate">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top 10 Vídeos */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 mb-6">
              <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">🏆 Top 10 Vídeos Mais Assistidos</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-black text-gray-500 border-b border-gray-100">
                      <th className="pb-2 pr-4">#</th>
                      <th className="pb-2 pr-4">Título</th>
                      <th className="pb-2 pr-4">Categoria</th>
                      <th className="pb-2 pr-4">Views</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topVideos.map((v, i) => (
                      <tr key={v.id} className="border-b border-gray-50 hover:bg-purple-50 transition-colors">
                        <td className="py-2 pr-4 font-black text-purple-600">{i + 1}</td>
                        <td className="py-2 pr-4 font-bold text-gray-800 max-w-xs truncate">{v.title}</td>
                        <td className="py-2 pr-4 text-xs font-semibold text-gray-500">{categoryLabels[v.category]}</td>
                        <td className="py-2 pr-4 font-black text-gray-800">{(v.views || 0).toLocaleString()}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${v.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {v.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}