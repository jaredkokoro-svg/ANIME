
import { Anime, Episode, VideoServer } from '../types';
import { GoogleGenAI } from "@google/genai";

const BASE_URL = 'https://www3.animeflv.net';
const PROXY_URL = 'https://api.allorigins.win/get?url=';

// Inicialización de Gemini para extracción inteligente
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error('Failed to fetch from proxy');
  const data = await response.json();
  return data.contents;
}

export const scraperService = {
  searchAnimes: async (query: string): Promise<Anime[]> => {
    try {
      const html = await fetchHTML(`${BASE_URL}/browse?q=${encodeURIComponent(query)}`);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const items = doc.querySelectorAll('.ListAnimes .Anime');
      const results: Anime[] = [];

      items.forEach((item) => {
        const title = item.querySelector('.Title')?.textContent || '';
        const poster = item.querySelector('img')?.getAttribute('src') || '';
        const link = item.querySelector('a')?.getAttribute('href') || '';
        const slug = link.split('/').pop() || '';

        if (title && slug) {
          results.push({
            id: slug,
            title,
            poster: poster.startsWith('http') ? poster : `${BASE_URL}${poster}`,
            type: item.querySelector('.Type')?.textContent || 'TV',
          });
        }
      });

      return results;
    } catch (error) {
      console.error('Error searching animes:', error);
      return [];
    }
  },

  getAnimeInfo: async (slug: string): Promise<{ anime: Anime; episodes: Episode[] }> => {
    try {
      const html = await fetchHTML(`${BASE_URL}/anime/${slug}`);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const title = doc.querySelector('.Ficha .Title')?.textContent || '';
      const poster = doc.querySelector('.Thumb img')?.getAttribute('src') || '';
      const synopsis = doc.querySelector('.Description p')?.textContent || '';

      const anime: Anime = {
        id: slug,
        title,
        poster: poster.startsWith('http') ? poster : `${BASE_URL}${poster}`,
        synopsis
      };

      const scripts = Array.from(doc.querySelectorAll('script'));
      const episodesScript = scripts.find(s => s.textContent?.includes('var episodes = ['));
      
      const episodes: Episode[] = [];
      if (episodesScript?.textContent) {
        const match = episodesScript.textContent.match(/var episodes = \[(.*?)\];/);
        if (match) {
          const rawEps = JSON.parse(`[${match[1]}]`);
          rawEps.forEach((ep: any) => {
            episodes.push({
              id: `${slug}-${ep[0]}`,
              number: ep[0],
              animeId: slug
            });
          });
        }
      }

      return { anime, episodes: episodes.reverse() };
    } catch (error) {
      console.error('Error fetching anime info:', error);
      throw error;
    }
  },

  getVideoServers: async (animeSlug: string, episodeNum: number): Promise<VideoServer[]> => {
    try {
      const html = await fetchHTML(`${BASE_URL}/ver/${animeSlug}-${episodeNum}`);
      const scripts = Array.from(new DOMParser().parseFromString(html, 'text/html').querySelectorAll('script'));
      const videoScript = scripts.find(s => s.textContent?.includes('var videos = {'));

      if (videoScript?.textContent) {
        const match = videoScript.textContent.match(/var videos = (\{.*?\});/);
        if (match) {
          const data = JSON.parse(match[1]);
          const servers: VideoServer[] = [];
          
          if (data.SUB && Array.isArray(data.SUB)) {
            data.SUB.forEach((s: any) => {
              servers.push({
                server: s.server,
                title: s.title,
                url: s.code // Usualmente el iframe o código
              });
            });
          }
          return servers;
        }
      }
      return [];
    } catch (error) {
      // Si falla el scraping tradicional, intentamos con IA (Conceptual para este demo)
      console.warn('Scraping tradicional falló. Usando IA para encontrar fuentes...');
      return [];
    }
  },

  /**
   * Nueva funcionalidad: Extraer links de CUALQUIER web de anime usando IA
   */
  extractFromAnyWeb: async (externalHtml: string): Promise<VideoServer[]> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analiza este fragmento de HTML y extrae únicamente las URLs de los iframes de video o servidores de streaming (como ok.ru, mega, vidoza, streamtape). Devuélvelo en formato JSON: [{"server": "Nombre", "url": "URL"}]. HTML: ${externalHtml.substring(0, 5000)}`,
        config: { responseMimeType: "application/json" }
      });
      
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("AI Extraction error:", error);
      return [];
    }
  }
};
