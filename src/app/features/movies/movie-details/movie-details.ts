import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MovieDetailsStore } from '../movie-details-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MovieList } from '../movie-list/movie-list';

@Component({
  selector: 'app-movie-details',
  imports: [AsyncPipe, NgOptimizedImage, MovieList, RouterLink],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetails {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(MovieDetailsStore);

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        takeUntilDestroyed(),
      )
      .subscribe((id) => this.store.load(id));
  }
}
