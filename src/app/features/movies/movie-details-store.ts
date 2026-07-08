import { inject, Injectable } from '@angular/core';
import { CastMember, Movie, MovieDetailsData } from './movie.models';
import { BehaviorSubject, catchError, distinctUntilChanged, EMPTY, forkJoin, map } from 'rxjs';
import { MovieApi } from './movie-api';

export interface MovieDetailsState {
  details: MovieDetailsData | null;
  cast: CastMember[];
  similar: Movie[];
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: MovieDetailsState = {
  details: null,
  cast: [],
  similar: [],
  loading: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class MovieDetailsStore {
  private readonly state$ = new BehaviorSubject<MovieDetailsState>(INITIAL_STATE);

  private readonly movieApi = inject(MovieApi);

  readonly details$ = this.state$.pipe(
    map((s) => s.details),
    distinctUntilChanged(),
  );

  readonly cast$ = this.state$.pipe(
    map((s) => s.cast),
    distinctUntilChanged(),
  );

  readonly similar$ = this.state$.pipe(
    map((s) => s.similar),
    distinctUntilChanged(),
  );

  readonly loading$ = this.state$.pipe(
    map((s) => s.loading),
    distinctUntilChanged(),
  );

  readonly error$ = this.state$.pipe(
    map((s) => s.error),
    distinctUntilChanged(),
  );

  load(id: number): void {
    this.patch({ loading: true, error: null });

    forkJoin({
      details: this.movieApi.getMovieDetails(id),
      cast: this.movieApi.getMovieCredits(id),
      similar: this.movieApi.getSimilarMovies(id),
    })
      .pipe(
        catchError(() => {
          this.patch({ error: 'Nie udało się załadować szczegółów.', loading: false });
          return EMPTY;
        }),
      )
      .subscribe(({ details, cast, similar }) =>
        this.patch({ loading: false, details, cast, similar }),
      );
  }

  private patch(partial: Partial<MovieDetailsState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }
}
