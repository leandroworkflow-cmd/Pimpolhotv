import { Megaphone } from "lucide-react";

const variants = {
  horizontal: {
    box: "w-full h-24 sm:h-[90px]",
    label: "728x90 — Leaderboard / Banner Horizontal",
  },
  square: {
    box: "w-full aspect-square max-w-[300px] mx-auto",
    label: "300x250 — Retângulo Médio",
  },
  vertical: {
    box: "w-full h-[600px] max-w-[160px]",
    label: "160x600 — Wide Skyscraper / Banner Lateral",
  },
};

export default function AdBanner({ type = "horizontal", className = "" }) {
  const variant = variants[type] || variants.horizontal;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/50 text-purple-300 text-center p-3 ${variant.box} ${className}`}
    >
      <Megaphone className="w-5 h-5" />
      <span className="text-xs font-bold text-purple-400">Espaço Google Ads</span>
      <span className="text-[10px] font-semibold text-purple-300">{variant.label}</span>
    </div>
  );
}
