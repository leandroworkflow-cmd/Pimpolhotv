import { db } from "@/api/base44Client";

import React, { useRef, useState } from "react";
import { Loader2, Camera, ImagePlus, X } from "lucide-react";

/**
 * Generic image uploader used for the channel profile photo, the
 * channel banner photo, and video thumbnails (same idea as YouTube's
 * "add photo" flows).
 *
 * shape:
 *  - "circle" -> profile photo (avatar)
 *  - "banner" -> wide channel banner/cover photo
 *  - "thumbnail" -> 16:9 video thumbnail
 */
export default function ImageUpload({ shape = "circle", value, onUploaded, onRemove, maxMB = 8 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Imagem muito grande! Máximo: ${maxMB}MB`);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      onUploaded(file_url);
    } catch (err) {
      setError("Erro no upload. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const openPicker = () => !uploading && inputRef.current.click();

  if (shape === "banner") {
    return (
      <div>
        <div
          onClick={openPicker}
          className="relative group w-full h-32 sm:h-40 rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-purple-200 hover:border-purple-400 transition-all bg-gray-50"
        >
          {value ? (
            <img src={value} alt="Banner do canal" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ImagePlus className="w-7 h-7 mb-1" />
              <span className="text-xs font-bold">Adicionar foto de banner</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold flex items-center gap-1 transition-opacity">
                <Camera className="w-4 h-4" /> {value ? "Trocar banner" : "Adicionar banner"}
              </span>
            )}
          </div>

          {value && !uploading && (
            <button
              type="button"
              onClick={(ev) => { ev.stopPropagation(); onRemove?.(); }}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
              title="Remover banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">Recomendado: imagem larga, tipo 2048x1152px (máx {maxMB}MB)</p>
        {error && <p className="text-xs text-red-500 font-bold mt-1">{error}</p>}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    );
  }

  // circle (avatar)
  if (shape === "circle") {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          onClick={openPicker}
          className="relative group w-20 h-20 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-purple-200 hover:border-purple-400 transition-all bg-gray-50 shrink-0"
        >
          {value ? (
            <img src={value} alt="Foto de perfil do canal" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImagePlus className="w-6 h-6" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
            {uploading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button type="button" onClick={openPicker} disabled={uploading} className="text-xs font-bold text-purple-600 hover:text-purple-700 text-left">
            {value ? "Trocar foto de perfil" : "Adicionar foto de perfil"}
          </button>
          {value && (
            <button type="button" onClick={() => onRemove?.()} className="text-xs font-bold text-gray-400 hover:text-red-500 text-left">
              Remover foto
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-bold mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
  }

  // thumbnail (16:9 video cover)
  return (
    <div>
      <div
        onClick={openPicker}
        className="relative group w-full aspect-video max-h-40 rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-purple-200 hover:border-purple-400 transition-all bg-gray-50 mx-auto"
      >
        {value ? (
          <img src={value} alt="Thumbnail do vídeo" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <ImagePlus className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">Adicionar thumbnail</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold flex items-center gap-1 transition-opacity">
              <Camera className="w-4 h-4" /> {value ? "Trocar thumbnail" : "Adicionar thumbnail"}
            </span>
          )}
        </div>

        {value && !uploading && (
          <button
            type="button"
            onClick={(ev) => { ev.stopPropagation(); onRemove?.(); }}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            title="Remover thumbnail"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-bold mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
