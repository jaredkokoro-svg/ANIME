
import React, { useState, useEffect } from 'react';
import { VideoServer } from '../types';
import { Server, AlertCircle, ShieldCheck, Zap } from 'lucide-react';

interface VideoPlayerProps {
  servers: VideoServer[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ servers }) => {
  const [activeServer, setActiveServer] = useState<VideoServer | null>(null);

  useEffect(() => {
    if (servers.length > 0 && !activeServer) {
      setActiveServer(servers[0]);
    }
  }, [servers]);

  if (servers.length === 0) {
    return (
      <div className="aspect-video w-full bg-zinc-950 rounded-2xl flex flex-col items-center justify-center gap-4 text-zinc-500 border border-zinc-800">
        <AlertCircle className="w-12 h-12 text-zinc-700" />
        <div className="text-center">
          <p className="text-lg font-medium text-zinc-300">No se encontraron servidores</p>
          <p className="text-sm">Intenta con otra fuente o recarga la página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
          <Zap className="w-3 h-3 fill-current" />
          Reproduciendo desde: {activeServer?.server || 'Desconocido'}
        </div>
        
        {activeServer && (
          <iframe
            key={activeServer.url}
            src={activeServer.url}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            // El atributo 'sandbox' ha sido eliminado para corregir el error de "Sandboxed embed is not allowed".
            // Muchos servidores externos bloquean la reproducción si detectan restricciones de sandbox.
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="Anime Player"
          />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase px-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Seleccionar Servidor (Compatibilidad Máxima)
        </div>
        <div className="flex flex-wrap gap-2">
          {servers.map((s, idx) => (
            <button
              key={`${s.server}-${idx}`}
              onClick={() => setActiveServer(s)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeServer?.url === s.url 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105' 
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
              <Server className="w-4 h-4" />
              {s.title || s.server}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
