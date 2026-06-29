const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { Shield, ShieldCheck, ShieldX, Loader2, AlertTriangle } from "lucide-react";

export default function AIContentFilter({ title, description, category, onResult }) {
  const [status, setStatus] = useState("idle"); // idle | checking | approved | rejected
  const [feedback, setFeedback] = useState(null);

  const checkContent = async () => {
    if (!title) return;
    setStatus("checking");
    setFeedback(null);

    try {
      const result = await db.integrations.Core.InvokeLLM({
        prompt: `Você é um filtro de segurança para uma plataforma de vídeos infantis chamada KidsTV.
        
Analise o conteúdo abaixo e determine se é ADEQUADO para crianças de até 12 anos.

Critérios de APROVAÇÃO:
- Conteúdo 100% infantil e familiar
- Desenhos animados, músicas infantis, histórias, jogos educativos
- Conteúdo educativo para crianças
- Linguagem simples e adequada para crianças

Critérios de REPROVAÇÃO (marque como inadequado se houver qualquer um):
- Violência, mesmo que leve
- Conteúdo assustador ou de terror
- Linguagem inadequada ou palavrões
- Conteúdo sexual ou romântico
- Política, ideologia ou religião específica
- Fake news ou desinformação
- Publicidade enganosa
- Qualquer tema adulto (álcool, drogas, crime, armas)
- Conteúdo para adolescentes acima de 12 anos

Título: "${title}"
Descrição: "${description || "Sem descrição"}"
Categoria: "${category}"

Responda em JSON com: approved (boolean), reason (string em português, max 100 chars), safe_score (número de 0 a 10, onde 10 é totalmente seguro para crianças).`,
        response_json_schema: {
          type: "object",
          properties: {
            approved: { type: "boolean" },
            reason: { type: "string" },
            safe_score: { type: "number" },
          },
        },
      });

      const approved = result.approved && result.safe_score >= 7;
      setStatus(approved ? "approved" : "rejected");
      setFeedback(result);
      onResult({ approved, feedback: result });
    } catch (e) {
      setStatus("idle");
      console.error(e);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={checkContent}
        disabled={status === "checking" || !title}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
          status === "idle"
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-200"
            : status === "checking"
            ? "bg-gray-50 text-gray-400 cursor-not-allowed border-2 border-gray-200"
            : status === "approved"
            ? "bg-green-50 text-green-600 border-2 border-green-200"
            : "bg-red-50 text-red-600 border-2 border-red-200"
        }`}
      >
        {status === "checking" && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === "idle" && <Shield className="w-4 h-4" />}
        {status === "approved" && <ShieldCheck className="w-4 h-4" />}
        {status === "rejected" && <ShieldX className="w-4 h-4" />}
        {status === "idle" && "🤖 Verificar com IA"}
        {status === "checking" && "Analisando conteúdo..."}
        {status === "approved" && "✅ Aprovado pela IA"}
        {status === "rejected" && "❌ Bloqueado pela IA"}
      </button>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${
          status === "approved" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          <div className="flex items-start gap-2">
            {status === "rejected" && <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
            <div>
              <p>{feedback.reason}</p>
              <p className="mt-1 text-gray-500">
                Pontuação de segurança: <span className="font-bold">{feedback.safe_score}/10</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}