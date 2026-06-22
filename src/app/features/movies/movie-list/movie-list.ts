import { Component, Input } from '@angular/core';
import { Movie } from '../movie.models';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-movie-list',
  imports: [MovieCard],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList {
  @Input({ required: true }) movies!: Movie[];
}
