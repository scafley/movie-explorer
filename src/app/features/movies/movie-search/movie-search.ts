import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MovieList } from '../movie-list/movie-list';
import { MovieStore } from '../movie-store';
import { combineLatest, debounceTime, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movie-search',
  imports: [ReactiveFormsModule, AsyncPipe, MovieList],
  templateUrl: './movie-search.html',
  styleUrl: './movie-search.scss',
})
export class MovieSearch implements OnInit {
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly genreControl = new FormControl<number | null>(null);

  protected readonly store = inject(MovieStore);
  private readonly destroyRef = inject(DestroyRef);

  // readonly genres$ = this.store.

  ngOnInit(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.genreControl.valueChanges.pipe(startWith(null)),
    ])
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(([query, genreId]) => this.store.search(query, genreId));

    //   this.searchControl.valueChanges
    //     .pipe(
    //       startWith(''),
    //       debounceTime(300),
    //       distinctUntilChanged(),

    //       takeUntilDestroyed(this.destroyRef),
    //     )
    //     .subscribe((q) => this.store.search(q));
  }
}

// readonly movies$ = this.searchControl.valueChanges.pipe(
//   startWith(''),
//   debounceTime(300),
//   distinctUntilChanged(),

//   switchMap((query) => {
//     const q = query.trim();

//     if (q.length < 2) return this.movieApi.getPopular();
//     return this.movieApi.searchMovies(q).pipe(catchError(() => of([] as Movie[])));
//   }),
// );
