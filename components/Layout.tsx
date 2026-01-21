
import React from 'react';
import { Search, Github, MonitorPlay, Star, User, LogOut, ChevronDown } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onSearchClick: () => void;
  onLogoClick: () => void;
  githubStars?: number;
  githubUrl?: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  userName?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onSearchClick, 
  onLogoClick, 
  githubStars = 0, 
  githubUrl = "#",
  isConnected,
  onConnect,
  onDisconnect,
  userName = "Guest"
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 group transition-all"
          >
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
              <MonitorPlay className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent hidden sm:block">
              AnimeIndexer
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button 
              onClick={onSearchClick}
              className="p-2.5 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700"
            >
              <Search className="w-5 h-5" />
            </button>

            {!isConnected ? (
              <button 
                onClick={onConnect}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 group"
              >
                <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Connect GitHub</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <a 
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl text-xs font-bold transition-all hover:bg-zinc-800"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>{githubStars} Stars</span>
                </a>
                
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all">
                    <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-[10px] font-bold">
                      {userName.substring(0,2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-zinc-300 hidden lg:block">{userName}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:rotate-180 transition-transform" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 z-[100]">
                    <div className="px-4 py-2 border-b border-zinc-800 mb-2">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cuenta Vinculada</p>
                      <p className="text-sm font-bold text-white truncate">{userName}</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button 
                      onClick={onDisconnect}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Disconnect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-zinc-900 py-12 bg-zinc-950 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-500 text-sm">
            <div className="space-y-2">
              <p className="font-bold text-zinc-300">AnimeIndexer Pro</p>
              <p>© 2024. Proyecto de código abierto para fines educativos.</p>
            </div>
            <div className="flex gap-8">
              <a href={githubUrl} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Repository
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Discord</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">API Docs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
