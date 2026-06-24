import { inject, Injectable } from '@angular/core';
import { Movie } from './movie.models';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
} from 'rxjs';
import { MovieApi } from './movie-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}
const INITIAL_STATE: MovieState = { movies: [], loading: false, error: null };

@Injectable({
  providedIn: 'root',
})
export class MovieStore {
  private readonly state$ = new BehaviorSubject<MovieState>(INITIAL_STATE);
  private readonly searchTrigger$ = new Subject<{ query: string; genreId: number | null }>();
  private readonly movieApi = inject(MovieApi);

  readonly movies$ = this.state$.pipe(
    map((state) => state.movies),
    distinctUntilChanged(),
  );

  readonly loading$ = this.state$.pipe(
    map((state) => state.loading),
    distinctUntilChanged(),
  );

  readonly error$ = this.state$.pipe(
    map((state) => state.error),
    distinctUntilChanged(),
  );

  readonly genres$ = this.movieApi
    .getGenres()
    .pipe(shareReplay({ refCount: false, bufferSize: 1 }));

  constructor() {
    this.searchTrigger$
      .pipe(
        switchMap(({ query, genreId }) => {
          this.patch({ loading: true, error: null });
          let source$: Observable<Movie[]>;
          if (query.trim().length >= 2) {
            source$ = this.movieApi.searchMovies(query.trim());
          } else if (genreId !== null) {
            source$ = this.movieApi.discoverMovies(genreId);
          } else {
            source$ = this.movieApi.getPopular();
          }

          return source$.pipe(
            catchError(() => {
              this.patch({ error: 'Nie udało się załadować filmów', loading: false });
              return of([]);
            }),
          );
        }),

        takeUntilDestroyed(),
      )
      .subscribe((movies) => {
        this.patch({ movies, loading: false });
      });
  }

  //rozpakowanie obecnego stanu i zmiana tylko tego co podajemy w partial
  private patch(partial: Partial<MovieState>): void {
    this.state$.next({
      ...this.state$.value,
      ...partial,
    });
  }

  search(query: string, genreId: number | null): void {
    this.searchTrigger$.next({ query, genreId });
  }

  loadPopular(): void {
    this.searchTrigger$.next({ query: '', genreId: null });
  }
}
