import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MovieApi } from '../movie-api';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { Movie } from '../movie.models';
import { AsyncPipe } from '@angular/common';
import { MovieList } from '../movie-list/movie-list';

@Component({
  selector: 'app-movie-search',
  imports: [ReactiveFormsModule, AsyncPipe, MovieList],
  templateUrl: './movie-search.html',
  styleUrl: './movie-search.scss',
})
export class MovieSearch {
  private readonly movieApi = inject(MovieApi);
  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly movies$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),

    switchMap((query) => {
      const q = query.trim();

      if (q.length < 2) return this.movieApi.getPopular();
      return this.movieApi.searchMovies(q).pipe(catchError(() => of([] as Movie[])));
    }),
  );
}
