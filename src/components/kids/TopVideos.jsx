import React from "react";
import { Link } from "react-router-dom";
import { Eye, Trophy } from "lucide-react";

const medals = ["🥇", "🥈", "🥉"];

export default function TopVideos({ videos }) {
  const top = [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  if (top.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" /> Mais Assistidos
      </h2>
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        {top.map((v, i) => (
          <Link
            key={v.id}
            to={`/watch/${v.id}`}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 hover:bg-purple-50 transition-colors border-b border-purple-50 last:border-0"
          >
            <span className="text-lg sm:text-xl w-6 sm:w-8 text-center shrink-0">{medals[i] || `${i + 1}º`}</span>
            <div className="w-12 h-8 sm:w-16 sm:h-10 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-purple-100 to-pink-100">
              {v.thumbnail_url ? (
                <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-base">🎬</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 sm:truncate">{v.title}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold shrink-0">
              <Eye className="w-3 h-3" />
              <span className="hidden xs:inline">{(v.views || 0).toLocaleString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}