import { Routes } from '@angular/router';
import { MovieSearch } from './features/movies/movie-search/movie-search';

export const routes: Routes = [
  {
    path: '',
    component: MovieSearch,
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movies/movie-details/movie-details').then((m) => m.MovieDetails),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/movies/favorites-page/favorites-page').then((m) => m.FavoritesPage),
  },
];
