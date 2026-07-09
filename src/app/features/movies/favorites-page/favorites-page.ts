import { Component, inject } from '@angular/core';
import { FavoritesStore } from '../favorites-store';
import { MovieList } from '../movie-list/movie-list';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  imports: [MovieList, AsyncPipe, RouterLink],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
})
export class FavoritesPage {
  protected readonly favorites = inject(FavoritesStore);
}
