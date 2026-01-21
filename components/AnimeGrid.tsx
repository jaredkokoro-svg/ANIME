
import React from 'react';
import { Anime } from '../types';
import { Play } from 'lucide-react';

interface AnimeGridProps {
  animes: Anime[];
  onSelect: (anime: Anime) => void;
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ animes, onSelect }) => {
  if (animes.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-8">
      {animes.map((anime) => (
        <button
          key={anime.id}
          onClick={() => onSelect(anime)}
          className="group relative flex flex-col gap-2 text-left"
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all">
            <img 
              src={anime.poster} 
              alt={anime.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-3 bg-indigo-600 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
            </div>
            {anime.type && (
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 text-[10px] font-bold uppercase rounded text-white shadow-lg">
                {anime.type}
              </span>
            )}
          </div>
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors px-1">
            {anime.title}
          </h3>
        </button>
      ))}
    </div>
  );
};

export default AnimeGrid;
