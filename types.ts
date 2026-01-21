
export interface Anime {
  id: string; // The slug
  title: string;
  poster: string;
  type?: string;
  rating?: string;
  synopsis?: string;
}

export interface Episode {
  id: string;
  number: number;
  animeId: string;
}

export interface VideoServer {
  server: string;
  title: string;
  url: string;
}

export interface SearchResult {
  animes: Anime[];
}
