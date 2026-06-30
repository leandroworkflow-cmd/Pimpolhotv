import { db } from "@/api/base44Client";

import React, { useState, useRef } from "react";

import { Upload, Loader2, CheckCircle, Film } from "lucide-react";

export default function VideoUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxMB = 500;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Arquivo muito grande! Máximo: ${maxMB}MB`);
      return;
    }

    setUploading(true);
    setProgress("Enviando vídeo...");
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      setProgress("✅ Upload concluído!");
      onUploaded(file_url);
    } catch (err) {
      setProgress("❌ Erro no upload. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          uploading ? "border-purple-300 bg-purple-50" : "border-purple-200 hover:border-purple-400 hover:bg-purple-50"
        }`}
      >
        {uploading ? (
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
        ) : (
          <Film className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        )}
        <p className="text-sm font-bold text-gray-600">
          {progress || "Clique para enviar um vídeo (MP4, WebM — máx 500MB)"}
        </p>
        {!uploading && (
          <p className="text-xs text-gray-400 mt-1">ou cole um link do YouTube abaixo</p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}