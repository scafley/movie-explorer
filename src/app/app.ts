import { Component, signal } from '@angular/core';
import { MovieSearch } from './features/movies/movie-search/movie-search';

@Component({
  selector: 'app-root',
  imports: [MovieSearch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('movie-explorer');
}
