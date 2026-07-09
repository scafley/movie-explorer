import { Component, inject, Input } from '@angular/core';
import { Movie } from '../movie.models';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesStore } from '../favorites-store';

@Component({
  selector: 'app-movie-card',
  imports: [NgOptimizedImage, RouterLink, AsyncPipe],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input({ required: true }) movie!: Movie;

  protected readonly favorites = inject(FavoritesStore);

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favorites.toggle(this.movie);
  }
}
