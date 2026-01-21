
import React from 'react';
import { Episode } from '../types';
import { PlayCircle } from 'lucide-react';

interface EpisodeListProps {
  episodes: Episode[];
  onSelect: (ep: Episode) => void;
  activeEpisodeId?: string;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, onSelect, activeEpisodeId }) => {
  return (
    <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-4">
      <h3 className="text-lg font-semibold mb-4 px-2">Episodes ({episodes.length})</h3>
      <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {episodes.map((ep) => (
          <button
            key={ep.id}
            onClick={() => onSelect(ep)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              activeEpisodeId === ep.id 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <PlayCircle className={`w-5 h-5 ${activeEpisodeId === ep.id ? 'text-white' : 'text-zinc-500'}`} />
            <span className="font-medium">Episode {ep.number}</span>
            {activeEpisodeId === ep.id && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider">Now Playing</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;
