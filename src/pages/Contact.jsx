import { db } from "@/api/base44Client";

import React, { useState } from "react";
import Navbar from "@/components/kids/Navbar";
import SEOHead from "@/components/kids/SEOHead";

import Footer from "@/components/kids/Footer";
import { Mail, MessageSquare, Phone, MapPin, Send, Loader2 } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Por favor, preencha nome, e-mail e mensagem.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await db.integrations.Core.SendEmail({
        to: "contato@cloudx.com.br",
        subject: `[Contato Site] ${form.subject || "Mensagem de " + form.name}`,
        body: `Nome: ${form.name}\nE-mail: ${form.email}\n\nMensagem:\n${form.message}`,
        from_name: "Pimpolho TV - Formulário de Contato",
      });
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      setError("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <SEOHead title="Contato" description="Entre em contato com a Pimpolho TV. Estamos aqui para ajudar!" />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <span className="text-6xl block mb-4">💌</span>
          <h1 className="text-4xl font-black text-gray-800 mb-2">Fale Conosco</h1>
          <p className="text-gray-600 font-semibold">Tem dúvidas, sugestões ou quer fazer parceria? Adoramos ouvir você!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h2 className="text-xl font-black text-gray-800 mb-5">📍 Nossos Contatos</h2>
              {[
                { icon: Mail, label: "E-mail", value: "contato@cloudx.com.br", color: "bg-purple-100 text-purple-600" },
                { icon: Phone, label: "Telefone / WhatsApp", value: "(31) 98373-3004", color: "bg-green-100 text-green-600" },
                { icon: MapPin, label: "Localização", value: "São Paulo, SP — Brasil", color: "bg-pink-100 text-pink-600" },
                { icon: MessageSquare, label: "Atendimento", value: "Seg à Sex, 9h às 18h", color: "bg-blue-100 text-blue-600" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400">{item.label}</p>
                    <p className="text-sm font-black text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="font-black text-lg mb-2">🤝 Quer Fazer Parceria?</h3>
              <p className="text-white/90 text-sm font-semibold leading-relaxed">
                Se você é criador de conteúdo infantil, escola ou marca voltada para crianças, adoraríamos conversar sobre como trabalhar juntos!
              </p>
              <p className="mt-3 text-white/80 text-sm font-bold">📧 contato@cloudx.com.br</p>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
            <h2 className="text-xl font-black text-gray-800 mb-5 flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-500" /> Envie sua Mensagem
            </h2>

            {sent ? (
              <div className="text-center py-12">
                <span className="text-6xl block mb-4">🎉</span>
                <h3 className="text-xl font-black text-green-700">Mensagem Enviada!</h3>
                <p className="text-gray-600 font-semibold mt-2">Obrigado! Retornaremos em até 48 horas.</p>
                <button onClick={() => setSent(false)} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors">
                  Enviar outra
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">Nome *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Seu nome"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-100 focus:border-purple-400 outline-none text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">E-mail *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-100 focus:border-purple-400 outline-none text-sm font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Assunto</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Sobre o que você quer falar?"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-100 focus:border-purple-400 outline-none text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Mensagem *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Escreva sua mensagem aqui..."
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-100 focus:border-purple-400 outline-none text-sm font-semibold resize-none"
                  />
                </div>
                {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}