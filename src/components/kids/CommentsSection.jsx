const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";

import { MessageCircle, Send, Heart, Loader2 } from "lucide-react";

function getSessionId() {
  let id = localStorage.getItem("kids_session_id");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("kids_session_id", id);
  }
  return id;
}

export default function CommentsSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(localStorage.getItem("kids_commenter_name") || "");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      const data = await db.entities.Comment.filter({ video_id: videoId }, "-created_date", 50);
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComments(); }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    try {
      localStorage.setItem("kids_commenter_name", name.trim());
      await db.entities.Comment.create({
        video_id: videoId,
        author_name: name.trim(),
        content: text.trim(),
        likes: 0,
      });
      setText("");
      loadComments();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (comment) => {
    await db.entities.Comment.update(comment.id, { likes: (comment.likes || 0) + 1 });
    loadComments();
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "agora mesmo";
    if (m < 60) return `${m}m atrás`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h atrás`;
    return `${Math.floor(h / 24)}d atrás`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 mt-4">
      <h3 className="text-base font-black text-gray-800 mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-purple-500" />
        Comentários ({comments.length})
      </h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-5 space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome 😊"
          maxLength={30}
          className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-purple-400"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva um comentário..."
            maxLength={300}
            className="flex-1 border border-purple-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            disabled={submitting || !name.trim() || !text.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 text-white rounded-xl px-4 flex items-center justify-center transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm text-gray-400 font-semibold py-6">
          Seja o primeiro a comentar! 🌟
        </p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-black shrink-0">
                {c.author_name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 bg-purple-50 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-700">{c.author_name}</span>
                  <span className="text-xs text-gray-400">{timeAgo(c.created_date)}</span>
                </div>
                <p className="text-sm text-gray-700 font-semibold mt-0.5">{c.content}</p>
                <button
                  onClick={() => handleLikeComment(c)}
                  className="flex items-center gap-1 mt-1 text-xs text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Heart className="w-3 h-3" />
                  {c.likes || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}