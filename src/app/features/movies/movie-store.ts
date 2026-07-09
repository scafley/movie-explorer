import { inject, Injectable } from '@angular/core';
import { Movie, MoviePage } from './movie.models';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  EMPTY,
  exhaustMap,
  map,
  Observable,
  of,
  retry,
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
  page: number;
  totalPages: number;
  query: string;
  genreId: number | null;
}
const INITIAL_STATE: MovieState = {
  movies: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  query: '',
  genreId: null,
};

@Injectable({
  providedIn: 'root',
})
export class MovieStore {
  private readonly state$ = new BehaviorSubject<MovieState>(INITIAL_STATE);
  private readonly searchTrigger$ = new Subject<{ query: string; genreId: number | null }>();
  private readonly movieApi = inject(MovieApi);
  private readonly loadMoreTrigger$ = new Subject<void>();

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

  readonly hasMore$ = this.state$.pipe(
    map((state) => state.page < state.totalPages),
    distinctUntilChanged(),
  );

  constructor() {
    this.searchTrigger$
      .pipe(
        switchMap(({ query, genreId }) => {
          this.patch({ loading: true, error: null, query, genreId, page: 1 });
          let source$: Observable<MoviePage>;
          if (query.trim().length >= 2) {
            source$ = this.movieApi.searchMovies(query.trim());
          } else if (genreId !== null) {
            source$ = this.movieApi.discoverMovies(genreId);
          } else {
            source$ = this.movieApi.getPopular();
          }

          return source$.pipe(
            retry({ count: 2, delay: 1000 }),
            catchError((err) => {
              console.error('Nie udało się załadować filmów', err);
              this.patch({ error: 'Nie udało się załadować filmów', loading: false });
              return of({ movies: [], page: 1, totalPages: 1 } as MoviePage);
            }),
          );
        }),

        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        this.patch({
          movies: result.movies,
          page: result.page,
          totalPages: result.totalPages,
          loading: false,
        });
      });

    this.loadMoreTrigger$
      .pipe(
        exhaustMap(() => {
          const { query, genreId, page, totalPages } = this.state$.value;

          if (page >= totalPages) {
            return EMPTY;
          }
          const nextPage = page + 1;

          this.patch({ loading: true });

          let source$: Observable<MoviePage>;
          if (query.trim().length >= 2) {
            source$ = this.movieApi.searchMovies(query.trim(), nextPage);
          } else if (genreId !== null) {
            source$ = this.movieApi.discoverMovies(genreId, undefined, nextPage);
          } else {
            source$ = this.movieApi.getPopular(nextPage);
          }

          return source$.pipe(
            retry({ count: 2, delay: 1000 }),
            catchError((err) => {
              console.error('Nie udało się doładować filmów', err);
              this.patch({ error: 'Nie udało się doładować filmów', loading: false });
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((result) => {
        this.patch({
          movies: [...this.state$.value.movies, ...result.movies],
          page: result.page,
          totalPages: result.totalPages,
          loading: false,
        });
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

  loadMore(): void {
    this.loadMoreTrigger$.next();
  }
}
