
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AnimeGrid from './components/AnimeGrid';
import EpisodeList from './components/EpisodeList';
import VideoPlayer from './components/VideoPlayer';
import { scraperService } from './services/scraperService';
import { githubService, RepoInfo } from './services/githubService';
import { Anime, Episode, VideoServer } from './types';
import { Search, Loader2, Play, Info, ArrowLeft, ChevronRight, Sparkles, Globe, Github } from 'lucide-react';

enum View { Home, Search, Details, Player }

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Home);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [trendingAnimes, setTrendingAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [videoServers, setVideoServers] = useState<VideoServer[]>([]);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  
  // GitHub Auth State
  const [isConnected, setIsConnected] = useState(() => localStorage.getItem('gh_connected') === 'true');
  const [userName, setUserName] = useState(() => localStorage.getItem('gh_user') || '');

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const results = await scraperService.searchAnimes('2025');
      setTrendingAnimes(results.slice(0, 12));
      
      // Intentamos cargar info del repo actual
      const githubData = await githubService.getRepoInfo('stackblitz', 'anime-indexer-pro');
      setRepoInfo(githubData);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  const handleConnectGitHub = () => {
    setLoading(true);
    // Simulamos un delay de OAuth
    setTimeout(() => {
      const mockUser = "DevUser_" + Math.floor(Math.random() * 100);
      setIsConnected(true);
      setUserName(mockUser);
      localStorage.setItem('gh_connected', 'true');
      localStorage.setItem('gh_user', mockUser);
      setLoading(false);
    }, 1500);
  };

  const handleDisconnectGitHub = () => {
    setIsConnected(false);
    setUserName('');
    localStorage.removeItem('gh_connected');
    localStorage.removeItem('gh_user');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setView(View.Search);
    const results = await scraperService.searchAnimes(searchQuery);
    setSearchResults(results);
    setLoading(false);
  };

  const handleAnimeSelect = async (anime: Anime) => {
    setLoading(true);
    setSelectedAnime(anime);
    const { anime: fullInfo, episodes } = await scraperService.getAnimeInfo(anime.id);
    setSelectedAnime(fullInfo);
    setEpisodes(episodes);
    setView(View.Details);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEpisodeSelect = async (episode: Episode) => {
    setLoading(true);
    setSelectedEpisode(episode);
    const servers = await scraperService.getVideoServers(episode.animeId, episode.number);
    setVideoServers(servers);
    setView(View.Player);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tryAiSearch = async () => {
    if (!selectedAnime || !selectedEpisode) return;
    setLoading(true);
    const aiResults = await scraperService.extractFromAnyWeb(`Buscando fuentes para ${selectedAnime.title}...`);
    if (aiResults.length > 0) {
      setVideoServers(prev => [...prev, ...aiResults]);
    }
    setLoading(false);
  };

  const goBack = () => {
    if (view === View.Player) setView(View.Details);
    else if (view === View.Details) setView(searchResults.length > 0 ? View.Search : View.Home);
    else if (view === View.Search) setView(View.Home);
  };

  const resetToHome = () => {
    setView(View.Home);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <Layout 
      onSearchClick={() => setView(View.Search)} 
      onLogoClick={resetToHome}
      githubStars={repoInfo?.stars}
      githubUrl={repoInfo?.url}
      isConnected={isConnected}
      onConnect={handleConnectGitHub}
      onDisconnect={handleDisconnectGitHub}
      userName={userName}
    >
      <div className="container mx-auto px-4 py-8">
        
        {loading && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
              {isConnected ? (
                 <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                       <Github className="w-10 h-10 text-white animate-bounce" />
                       <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                    </div>
                    <p className="text-white font-bold tracking-tighter">VINCULANDO CON GITHUB...</p>
                 </div>
              ) : (
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative" />
              )}
            </div>
          </div>
        )}

        {view === View.Home && (
          <div className="space-y-16">
            <section className="relative py-24 rounded-[3rem] overflow-hidden bg-zinc-950 border border-zinc-900">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 blur-[120px] rounded-full translate-x-1/2" />
              <div className="relative z-10 px-8 lg:px-16 flex flex-col items-center text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold mb-6 tracking-widest uppercase">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Indexer
                </div>
                <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-white leading-none">
                  Tu <span className="text-indigo-500">Anime</span> <br/>Sin Límites.
                </h1>
                <p className="text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
                  Conexión directa con múltiples servidores y extracción inteligente de links con IA.
                </p>
                <form onSubmit={handleSearch} className="w-full max-w-xl relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Escribe el nombre de un anime..."
                    className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 py-5 px-8 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500/50 group-focus-within:border-indigo-500 transition-all shadow-2xl text-lg pr-32"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-3 bottom-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 rounded-2xl transition-all font-bold shadow-lg shadow-indigo-600/20"
                  >
                    Buscar
                  </button>
                </form>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-indigo-600 rounded-full"></div>
                <h2 className="text-3xl font-bold tracking-tight">Estrenos 2025</h2>
              </div>
              <AnimeGrid animes={trendingAnimes} onSelect={handleAnimeSelect} />
            </section>
          </div>
        )}

        {view === View.Search && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <button onClick={goBack} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-all border border-zinc-800">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Resultados</h2>
                <p className="text-zinc-500">Búsqueda: "{searchQuery}"</p>
              </div>
            </div>
            <AnimeGrid animes={searchResults} onSelect={handleAnimeSelect} />
          </div>
        )}

        {view === View.Details && selectedAnime && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/3 space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-indigo-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative aspect-[2/3] w-full rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <img src={selectedAnime.poster} alt={selectedAnime.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <button 
                  onClick={() => episodes[0] && handleEpisodeSelect(episodes[0])}
                  className="w-full py-5 bg-white text-black hover:bg-zinc-200 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl"
                >
                  <Play className="w-6 h-6 fill-current" />
                  VER AHORA
                </button>
              </div>
              <div className="lg:w-2/3 space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <button onClick={goBack} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 font-bold text-sm uppercase tracking-widest">
                      ATRÁS
                    </button>
                    <ChevronRight className="w-4 h-4 text-zinc-800" />
                    <span className="text-indigo-500 font-bold text-sm uppercase tracking-widest">DETALLES</span>
                  </div>
                  <h1 className="text-6xl font-black tracking-tighter leading-none">{selectedAnime.title}</h1>
                  <p className="text-xl text-zinc-400 leading-relaxed border-l-2 border-zinc-800 pl-6 py-2">
                    {selectedAnime.synopsis || 'Sinopsis no disponible.'}
                  </p>
                </div>
                <div className="bg-zinc-950 rounded-[2.5rem] border border-zinc-900 p-8 shadow-inner">
                   <EpisodeList episodes={episodes} onSelect={handleEpisodeSelect} />
                </div>
              </div>
            </div>
          </div>
        )}

        {view === View.Player && selectedAnime && selectedEpisode && (
          <div className="max-w-7xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    <button onClick={goBack} className="hover:text-white transition-colors">{selectedAnime.title}</button>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-indigo-400">Episodio {selectedEpisode.number}</span>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight">Reproduciendo ahora</h1>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={tryAiSearch}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-2xl font-bold transition-all"
                  >
                    <Globe className="w-5 h-5" />
                    Buscar otras webs
                  </button>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <VideoPlayer servers={videoServers} />
                  <div className="p-8 bg-zinc-900/50 rounded-[2rem] border border-zinc-800/50 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-white/10">
                      <img src={selectedAnime.poster} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{selectedAnime.title}</h4>
                      <p className="text-zinc-500 text-sm">Viendo Episodio {selectedEpisode.number}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="sticky top-24">
                    <EpisodeList 
                      episodes={episodes} 
                      onSelect={handleEpisodeSelect} 
                      activeEpisodeId={selectedEpisode.id}
                    />
                  </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default App;
