import React from "react";
import VideoCard from "./VideoCard";

export default function VideoGrid({ videos, title, emoji }) {
  if (!videos?.length) return null;

  return (
    <section>
      {title && (
        <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
          {emoji && <span className="text-2xl">{emoji}</span>}
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} />
        ))}
      </div>
    </section>
  );
}