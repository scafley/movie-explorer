export interface TmdbMovieDto {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TmdbPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  releaseYear: string;
  rating: number;
}

export interface Genre {
  id: number;
  name: string;
}
