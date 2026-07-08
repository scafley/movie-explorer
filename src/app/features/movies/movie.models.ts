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

export interface MoviePage {
  movies: Movie[];
  page: number;
  totalPages: number;
}

export interface MovieDetailsData extends Movie {
  genres: Genre[];
  runtime: number;
  tagline: string;
  budget: number;
  voteCount: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface TmdbCastDto {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbMovieDetailsDto extends TmdbMovieDto {
  runtime: number;
  tagline: string;
  budget: number;
  vote_count: number;
  genres: Genre[];
}
