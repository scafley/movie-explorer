import { Component, Input } from '@angular/core';
import { Movie } from '../movie.models';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  imports: [NgOptimizedImage],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input({ required: true }) movie!: Movie;
}
