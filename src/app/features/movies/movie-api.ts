import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { map, Observable } from 'rxjs';
import { Movie, TmdbPagedResponse, TmdbMovieDto, Genre, MoviePage } from './movie.models';

@Injectable({
  providedIn: 'root',
})
export class MovieApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdb.baseUrl;
  private readonly imageBaseUrl = environment.tmdb.imageBaseUrl;

  searchMovies(query: string, page = 1): Observable<MoviePage> {
    return this.http
      .get<
        TmdbPagedResponse<TmdbMovieDto>
      >(`${this.baseUrl}/search/movie`, { params: { query, page } })
      .pipe(
        map((res) => ({
          movies: res.results.map((dto) => this.toMovie(dto)),
          page: res.page,
          totalPages: res.total_pages,
        })),
      );
  }

  getPopular(page = 1): Observable<MoviePage> {
    return this.http
      .get<TmdbPagedResponse<TmdbMovieDto>>(`${this.baseUrl}/movie/popular`, { params: { page } })
      .pipe(
        map((res) => ({
          movies: res.results.map((dto) => this.toMovie(dto)),
          page: res.page,
          totalPages: res.total_pages,
        })),
      );
  }

  getGenres(): Observable<Genre[]> {
    return this.http
      .get<{ genres: Genre[] }>(`${this.baseUrl}/genre/movie/list`)
      .pipe(map((res) => res.genres));
  }

  discoverMovies(genreId: number, sortBy = 'popularity.desc', page = 1): Observable<MoviePage> {
    return this.http
      .get<
        TmdbPagedResponse<TmdbMovieDto>
      >(`${this.baseUrl}/discover/movie`, { params: { with_genres: genreId, sort_by: sortBy, page } })
      .pipe(
        map((res) => ({
          movies: res.results.map((dto) => this.toMovie(dto)),
          page: res.page,
          totalPages: res.total_pages,
        })),
      );
  }

  private toMovie(dto: TmdbMovieDto): Movie {
    return {
      id: dto.id,
      title: dto.title,
      overview: dto.overview,
      posterUrl: dto.poster_path ? `${this.imageBaseUrl}/w342${dto.poster_path}` : null,
      releaseYear: dto.release_date ? dto.release_date.slice(0, 4) : '—',
      rating: Math.round(dto.vote_average * 10) / 10,
    };
  }
}
