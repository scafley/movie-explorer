import { Component, inject } from '@angular/core';
import { FavoritesStore } from '../favorites-store';
import { MovieList } from '../movie-list/movie-list';
import { AsyncPipe, Location } from '@angular/common';

@Component({
  selector: 'app-favorites-page',
  imports: [MovieList, AsyncPipe],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
})
export class FavoritesPage {
  protected readonly favorites = inject(FavoritesStore);
  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }
}
