import { TestBed } from '@angular/core/testing';

import { MovieStore } from './movie-store';
import { of } from 'rxjs';
import { MovieApi } from './movie-api';
import { Movie, MoviePage } from './movie.models';

describe('MovieStore', () => {
  let service: MovieStore;

  const fakeMovie: Movie = {
    id: 1,
    title: 'Test movie',
    overview: 'Lorem ipsum',
    posterUrl: null,
    releaseYear: '2026',
    rating: 8.88,
  };

  const fakePage: MoviePage = {
    movies: [fakeMovie],
    page: 1,
    totalPages: 5,
  };

  const movieApiMock = {
    getPopular: vi.fn(() => of(fakePage)),
    searchMovies: vi.fn(() => of(fakePage)),
    discoverMovies: vi.fn(() => of(fakePage)),
    getGenres: vi.fn(() => of([])),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: MovieApi, useValue: movieApiMock }],
    });
    service = TestBed.inject(MovieStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load popular movies when query and genre are empty', () => {
    service.search('', null);
    expect(movieApiMock.getPopular).toHaveBeenCalled();
    expect(movieApiMock.searchMovies).not.toHaveBeenCalled();
    expect(movieApiMock.discoverMovies).not.toHaveBeenCalled();
  });

  it('should search for matrix movie', () => {
    service.search('matrix', null);

    expect(movieApiMock.searchMovies).toHaveBeenCalledWith('matrix');
    expect(movieApiMock.getPopular).not.toHaveBeenCalled();
  });

  it('should search for genre 8 movies', () => {
    service.search('', 8);

    expect(movieApiMock.discoverMovies).toHaveBeenCalledWith(8);
    expect(movieApiMock.getPopular).not.toHaveBeenCalled();
  });

  it('should search for matrix movie and ignore genre id ', () => {
    service.search('matrix', 8);
    expect(movieApiMock.searchMovies).toHaveBeenCalledWith('matrix');
    expect(movieApiMock.getPopular).not.toHaveBeenCalled();
    expect(movieApiMock.discoverMovies).not.toHaveBeenCalled();
  });

  it('it should ignore short text and show popular movies', () => {
    service.search('m', null);
    expect(movieApiMock.getPopular).toHaveBeenCalled();
    expect(movieApiMock.searchMovies).not.toHaveBeenCalled();
  });

  it('should append movies when loading more', () => {
    let movies: Movie[] = [];
    service.movies$.subscribe((m) => (movies = m));

    service.search('', null);
    expect(movies.length).toBe(1);

    service.loadMore();
    expect(movies.length).toBe(2);
  });

  it('should reset list when search for new movies', () => {
    let movies: Movie[] = [];
    service.movies$.subscribe((m) => (movies = m));

    service.search('', null);
    expect(movies.length).toBe(1);

    service.loadMore();
    expect(movies.length).toBe(2);

    service.search('matrix', null);
    expect(movies.length).toBe(1);
  });

  it('should not load more when on last page', () => {
    movieApiMock.getPopular.mockReturnValueOnce(
      of({ movies: [fakeMovie], page: 5, totalPages: 5 }),
    );

    service.search('', null);
    vi.clearAllMocks();

    service.loadMore();
    expect(movieApiMock.getPopular).not.toHaveBeenCalled();
    expect(movieApiMock.searchMovies).not.toHaveBeenCalled();
    expect(movieApiMock.discoverMovies).not.toHaveBeenCalled();
  });
});
