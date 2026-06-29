const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "@/components/kids/Navbar";
import VideoUpload from "@/components/kids/VideoUpload";
import AIContentFilter from "@/components/kids/AIContentFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Eye, Tv2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const categories = [
  { value: "desenhos", label: "🎨 Desenhos" },
  { value: "musicas", label: "🎵 Músicas" },
  { value: "educativos", label: "📚 Educativos" },
  { value: "historias", label: "📖 Histórias" },
  { value: "jogos", label: "🎮 Jogos" },
];

const ageGroups = [
  { value: "0-3", label: "👶 0-3 anos" },
  { value: "4-6", label: "🧒 4-6 anos" },
  { value: "7-9", label: "👦 7-9 anos" },
  { value: "10-12", label: "🧑 10-12 anos" },
];

const emojis = ["🎬", "🌟", "🎨", "🎵", "📚", "🦁", "🐯", "🦊", "🐸", "🌈", "🚀", "⭐"];
const banners = [
  { label: "Roxo & Rosa", value: "from-purple-500 to-pink-500" },
  { label: "Azul & Ciano", value: "from-blue-500 to-cyan-400" },
  { label: "Verde & Menta", value: "from-green-500 to-emerald-400" },
  { label: "Laranja & Amarelo", value: "from-orange-500 to-yellow-400" },
];

const emptyVideo = { title: "", description: "", video_url: "", thumbnail_url: "", category: "desenhos", age_group: "4-6", duration: "", status: "active", featured: false };

export default function MyChannel() {
  const [user, setUser] = useState(null);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Channel form
  const [channelForm, setChannelForm] = useState({ name: "", description: "", avatar_emoji: "🎬", banner_color: "from-purple-500 to-pink-500" });
  const [editingChannel, setEditingChannel] = useState(false);

  // Video form
  const [videoDialog, setVideoDialog] = useState(false);
  const [videoForm, setVideoForm] = useState(emptyVideo);
  const [editVideoId, setEditVideoId] = useState(null);
  const [aiApproved, setAiApproved] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const u = await db.auth.me();
        setUser(u);
        const channels = await db.entities.Channel.filter({ owner_id: u.id });
        if (channels[0]) {
          setChannel(channels[0]);
          setChannelForm({ name: channels[0].name, description: channels[0].description || "", avatar_emoji: channels[0].avatar_emoji || "🎬", banner_color: channels[0].banner_color || "from-purple-500 to-pink-500" });
          const vids = await db.entities.Video.filter({ channel_id: channels[0].id }, "-created_date", 100);
          setVideos(vids);
        }
      } catch (e) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveChannel = async () => {
    if (!channelForm.name.trim()) { toast({ title: "Digite o nome do canal", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (channel) {
        const updated = await db.entities.Channel.update(channel.id, channelForm);
        setChannel(updated);
      } else {
        const created = await db.entities.Channel.create({ ...channelForm, owner_id: user.id, subscribers: 0 });
        setChannel(created);
      }
      setEditingChannel(false);
      toast({ title: channel ? "Canal atualizado! ✅" : "Canal criado! 🎉" });
    } catch (e) {
      toast({ title: "Erro ao salvar canal", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const openNewVideo = () => {
    setVideoForm(emptyVideo);
    setEditVideoId(null);
    setAiApproved(false);
    setVideoDialog(true);
  };

  const openEditVideo = (v) => {
    setVideoForm({ title: v.title, description: v.description || "", video_url: v.video_url, thumbnail_url: v.thumbnail_url || "", category: v.category, age_group: v.age_group, duration: v.duration || "", status: v.status, featured: v.featured || false });
    setEditVideoId(v.id);
    setAiApproved(false);
    setVideoDialog(true);
  };

  const saveVideo = async () => {
    if (!videoForm.title || !videoForm.video_url) { toast({ title: "Preencha título e vídeo", variant: "destructive" }); return; }
    if (!aiApproved) { toast({ title: "⚠️ Verifique o conteúdo com a IA!", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editVideoId) {
        await db.entities.Video.update(editVideoId, videoForm);
        toast({ title: "Vídeo atualizado! ✅" });
      } else {
        await db.entities.Video.create({ ...videoForm, channel_id: channel.id, views: 0 });
        toast({ title: "Vídeo adicionado! 🎉" });
      }
      setVideoDialog(false);
      const vids = await db.entities.Video.filter({ channel_id: channel.id }, "-created_date", 100);
      setVideos(vids);
    } catch (e) {
      toast({ title: "Erro ao salvar vídeo", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteVideo = async (id) => {
    if (!confirm("Excluir este vídeo?")) return;
    await db.entities.Video.delete(id);
    setVideos(videos.filter((v) => v.id !== id));
    toast({ title: "Vídeo excluído 🗑️" });
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Navbar />
      <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 text-purple-500 animate-spin" /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
          <Tv2 className="w-6 h-6 text-purple-500" /> Meu Canal
        </h1>

        {/* Channel card / create */}
        {!channel || editingChannel ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-6">
            <h2 className="font-black text-gray-700 mb-4">{channel ? "✏️ Editar Canal" : "🌟 Criar meu Canal"}</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-bold">Nome do canal *</Label>
                <Input value={channelForm.name} onChange={(e) => setChannelForm({ ...channelForm, name: e.target.value })} placeholder="Ex: Canal da Turma da Mônica" className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-sm font-bold">Descrição</Label>
                <Textarea value={channelForm.description} onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })} placeholder="Sobre o canal..." rows={2} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-sm font-bold">Emoji do Avatar</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {emojis.map((e) => (
                    <button key={e} onClick={() => setChannelForm({ ...channelForm, avatar_emoji: e })}
                      className={`text-2xl p-2 rounded-xl transition-all ${channelForm.avatar_emoji === e ? "bg-purple-200 scale-110" : "bg-gray-100 hover:bg-purple-100"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-bold">Cor do Banner</Label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {banners.map((b) => (
                    <button key={b.value} onClick={() => setChannelForm({ ...channelForm, banner_color: b.value })}
                      className={`h-8 w-24 rounded-lg bg-gradient-to-r ${b.value} border-2 transition-all ${channelForm.banner_color === b.value ? "border-gray-800 scale-105" : "border-transparent"}`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveChannel} disabled={saving} className="bg-purple-600 hover:bg-purple-700 rounded-xl font-bold">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {channel ? "Salvar" : "Criar Canal"}
                </Button>
                {channel && <Button variant="outline" onClick={() => setEditingChannel(false)} className="rounded-xl font-bold">Cancelar</Button>}
              </div>
            </div>
          </div>
        ) : (
          <div className={`bg-gradient-to-r ${channel.banner_color} rounded-2xl p-5 mb-6 flex items-center gap-4 text-white shadow`}>
            <div className="text-4xl">{channel.avatar_emoji}</div>
            <div className="flex-1">
              <h2 className="text-xl font-black">{channel.name}</h2>
              {channel.description && <p className="text-white/80 text-sm font-semibold">{channel.description}</p>}
              <p className="text-white/70 text-xs mt-1">{videos.length} vídeos</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingChannel(true)} className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all">
                <Pencil className="w-4 h-4" />
              </button>
              <Link to={`/channel/${channel.id}`} className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all">
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Videos section */}
        {channel && !editingChannel && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-700">Meus Vídeos</h2>
              <Button onClick={openNewVideo} className="bg-purple-600 hover:bg-purple-700 rounded-full font-bold gap-2 text-sm">
                <Plus className="w-4 h-4" /> Adicionar Vídeo
              </Button>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-purple-100">
                <span className="text-5xl block mb-3">🎬</span>
                <p className="font-black text-gray-700">Nenhum vídeo ainda</p>
                <p className="text-sm text-gray-400 font-semibold mt-1">Adicione o primeiro vídeo do seu canal!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-purple-100">
                    <div className="w-20 h-12 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-purple-100 to-pink-100">
                      {v.thumbnail_url ? <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{v.title}</p>
                      <p className="text-xs text-gray-400 font-semibold flex items-center gap-1"><Eye className="w-3 h-3" /> {(v.views || 0).toLocaleString()} views</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditVideo(v)} className="p-1.5 rounded-full hover:bg-blue-50 text-blue-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteVideo(v.id)} className="p-1.5 rounded-full hover:bg-red-50 text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Video Dialog */}
      <Dialog open={videoDialog} onOpenChange={setVideoDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black">{editVideoId ? "✏️ Editar Vídeo" : "➕ Novo Vídeo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-bold">Título *</Label>
              <Input value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="Título do vídeo" className="rounded-xl mt-1" />
            </div>
            <div>
              <Label className="text-sm font-bold">Vídeo *</Label>
              <div className="mt-1 space-y-2">
                <VideoUpload onUploaded={(url) => setVideoForm({ ...videoForm, video_url: url })} />
                <p className="text-xs text-center text-gray-400">— ou cole um link —</p>
                <Input value={videoForm.video_url} onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="rounded-xl" />
                {videoForm.video_url && <p className="text-xs text-green-600 font-bold">✅ Vídeo definido</p>}
              </div>
            </div>
            <div>
              <Label className="text-sm font-bold">Thumbnail (URL)</Label>
              <Input value={videoForm.thumbnail_url} onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })} placeholder="https://..." className="rounded-xl mt-1" />
            </div>
            <div>
              <Label className="text-sm font-bold">Descrição</Label>
              <Textarea value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} rows={2} className="rounded-xl mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-bold">Categoria</Label>
                <Select value={videoForm.category} onValueChange={(v) => setVideoForm({ ...videoForm, category: v })}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-bold">Faixa Etária</Label>
                <Select value={videoForm.age_group} onValueChange={(v) => setVideoForm({ ...videoForm, age_group: v })}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{ageGroups.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs font-bold text-gray-500 mb-2">🤖 Verificação de Segurança (obrigatória)</p>
              <AIContentFilter title={videoForm.title} description={videoForm.description} category={videoForm.category} onResult={({ approved }) => setAiApproved(approved)} />
            </div>
            <Button onClick={saveVideo} disabled={saving || !aiApproved} className={`w-full rounded-xl font-bold py-5 ${aiApproved ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editVideoId ? "Salvar Alterações" : "Publicar Vídeo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}