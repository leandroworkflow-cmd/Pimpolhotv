import { db } from "@/api/base44Client";

import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import Navbar from "@/components/kids/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Eye, Loader2, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AIContentFilter from "@/components/kids/AIContentFilter";
import VideoUpload from "@/components/kids/VideoUpload";

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

const emptyForm = {
  title: "",
  description: "",
  video_url: "",
  thumbnail_url: "",
  category: "desenhos",
  age_group: "4-6",
  duration: "",
  featured: false,
  status: "active",
};

export default function Admin() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState("");
  const [aiApproved, setAiApproved] = useState(false);
  const { toast } = useToast();

  const loadVideos = async () => {
    try {
      const data = await db.entities.Video.list("-created_date", 100);
      setVideos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => setUser(null)).finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => { if (user?.role === "admin") loadVideos(); }, [user]);

  const handleSave = async () => {
    if (!form.title || !form.video_url) {
      toast({ title: "Preencha o título e URL do vídeo", variant: "destructive" });
      return;
    }
    if (!aiApproved) {
      toast({ title: "⚠️ Verifique o conteúdo com a IA antes de salvar!", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await db.entities.Video.update(editId, form);
        toast({ title: "Vídeo atualizado! ✅" });
      } else {
        const created = await db.entities.Video.create(form);
        toast({ title: "Vídeo adicionado! 🎉" });
        // Notifica o admin por e-mail
        db.integrations.Core.SendEmail({
          to: user.email,
          subject: "🎬 Novo vídeo adicionado — Pimpolho TV",
          body: `Olá Admin!\n\nUm novo vídeo foi adicionado à plataforma:\n\nTítulo: ${form.title}\nCategoria: ${form.category}\nFaixa Etária: ${form.age_group}\n\nAcesse o painel para gerenciá-lo.\n\n— Pimpolho TV 🌟`,
          from_name: "Pimpolho TV",
        }).catch(() => {});
      }
      setDialogOpen(false);
      setForm(emptyForm);
      setEditId(null);
      loadVideos();
    } catch (e) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (video) => {
    setAiApproved(false);
    setForm({
      title: video.title || "",
      description: video.description || "",
      video_url: video.video_url || "",
      thumbnail_url: video.thumbnail_url || "",
      category: video.category || "desenhos",
      age_group: video.age_group || "4-6",
      duration: video.duration || "",
      featured: video.featured || false,
      status: video.status || "active",
    });
    setEditId(video.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;
    try {
      await db.entities.Video.delete(id);
      toast({ title: "Vídeo excluído! 🗑️" });
      loadVideos();
    } catch (e) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditId(null);
    setAiApproved(false);
    setDialogOpen(true);
  };

  const filtered = filterCat ? videos.filter((v) => v.category === filterCat) : videos;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center px-4">
        <Navbar />
        <span className="text-7xl mb-4 mt-10">🔒</span>
        <h2 className="text-2xl font-black text-gray-700 text-center">Acesso Restrito</h2>
        <p className="text-gray-500 mt-2 font-semibold text-center">Apenas administradores podem acessar esta área.</p>
        <Link to="/" className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              🛡️ Painel Administrativo
            </h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">Gerencie o conteúdo da plataforma</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/dashboard" className="flex items-center gap-1.5 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-bold text-sm hover:bg-purple-200 transition-colors">
              <TrendingUp className="w-4 h-4" /> Analytics
            </Link>
            <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 rounded-full font-bold gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Vídeo
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterCat("")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              !filterCat ? "bg-purple-600 text-white" : "bg-white text-gray-600 border border-purple-200"
            }`}
          >
            Todos ({videos.length})
          </button>
          {categories.map((c) => {
            const count = videos.filter((v) => v.category === c.value).length;
            return (
              <button
                key={c.value}
                onClick={() => setFilterCat(c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filterCat === c.value ? "bg-purple-600 text-white" : "bg-white text-gray-600 border border-purple-200"
                }`}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Video list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((video) => (
              <div key={video.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:border-purple-200 transition-colors">
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-purple-100 to-pink-100">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-800 truncate">{video.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      {categories.find((c) => c.value === video.category)?.label || video.category}
                    </span>
                    <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                      {ageGroups.find((a) => a.value === video.age_group)?.label || video.age_group}
                    </span>
                    {video.featured && (
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                        ⭐ Destaque
                      </span>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      video.status === "active" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                    }`}>
                      {video.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>

                {/* Views */}
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 font-semibold">
                  <Eye className="w-3 h-3" />
                  {(video.views || 0).toLocaleString()}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(video)} className="rounded-full h-8 w-8 p-0 text-blue-600 hover:bg-blue-50">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(video.id)} className="rounded-full h-8 w-8 p-0 text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">📺</span>
            <h2 className="text-xl font-black text-gray-700">Nenhum vídeo cadastrado</h2>
            <p className="text-gray-500 font-semibold mt-2">Adicione vídeos para as crianças assistirem!</p>
          </div>
        )}

        {/* Dialog form */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-black">
                {editId ? "✏️ Editar Vídeo" : "➕ Novo Vídeo"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-bold">Título *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Peppa Pig - Dia de Chuva"
                  className="rounded-xl mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-bold">Vídeo *</Label>
                <div className="mt-1 space-y-2">
                  <VideoUpload onUploaded={(url) => setForm({ ...form, video_url: url })} />
                  <p className="text-xs text-center text-gray-400 font-semibold">— ou cole um link —</p>
                  <Input
                    value={form.video_url}
                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="rounded-xl"
                  />
                  {form.video_url && (
                    <p className="text-xs text-green-600 font-bold">✅ Vídeo: {form.video_url.slice(0, 60)}...</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-bold">URL da Thumbnail</Label>
                <Input
                  value={form.thumbnail_url}
                  onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                  className="rounded-xl mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-bold">Descrição</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Sobre o que é esse vídeo..."
                  className="rounded-xl mt-1"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-bold">Categoria</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-bold">Faixa Etária</Label>
                  <Select value={form.age_group} onValueChange={(v) => setForm({ ...form, age_group: v })}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ageGroups.map((a) => (
                        <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-bold">Duração</Label>
                  <Input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="Ex: 12:30"
                    className="rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">✅ Ativo</SelectItem>
                      <SelectItem value="inactive">❌ Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
                <Label className="text-sm font-bold">⭐ Destaque na página inicial</Label>
              </div>
              {/* AI Filter - obrigatório antes de salvar */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                  🤖 Verificação de Segurança (obrigatória)
                </p>
                <AIContentFilter
                  title={form.title}
                  description={form.description}
                  category={form.category}
                  onResult={({ approved }) => setAiApproved(approved)}
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || !aiApproved}
                className={`w-full rounded-xl font-bold text-base py-5 transition-all ${
                  aiApproved
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editId ? "Salvar Alterações" : "Adicionar Vídeo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}