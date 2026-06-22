import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Movie, TmdbPagedResponse, TmdbMovieDto } from './movie.models';

@Injectable({
  providedIn: 'root',
})
export class MovieApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdb.baseUrl;
  private readonly imageBaseUrl = environment.tmdb.imageBaseUrl;

  searchMovies(query: string, page = 1): Observable<Movie[]> {
    return this.http
      .get<
        TmdbPagedResponse<TmdbMovieDto>
      >(`${this.baseUrl}/search/movie`, { params: { query, page } })
      .pipe(map((res) => res.results.map((dto) => this.toMovie(dto))));
  }

  getPopular(page = 1): Observable<Movie[]> {
    return this.http
      .get<TmdbPagedResponse<TmdbMovieDto>>(`${this.baseUrl}/movie/popular`, { params: { page } })
      .pipe(map((res) => res.results.map((dto) => this.toMovie(dto))));
  }

  private toMovie(dto: TmdbMovieDto): Movie {
    return {
      id: dto.id,
      title: dto.title,
      overview: dto.overview,
      posterUrl: dto.poster_path ? `${this.imageBaseUrl}/w342${dto.poster_path}` : null,
      releaseYear: dto.release_date ? dto.release_date.slice(0, 4) : '—',
      rating: dto.vote_average,
    };
  }
}
