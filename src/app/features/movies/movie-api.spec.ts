import { TestBed } from '@angular/core/testing';

import { MovieApi } from './movie-api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CastMember, Genre, MoviePage } from './movie.models';

describe('MovieApi', () => {
  let service: MovieApi;
  let httpMock: HttpTestingController;

  const fakeResponse = {
    page: 1,
    total_pages: 10,
    total_results: 200,
    results: [
      {
        id: 1,
        title: 'Test Movie',
        overview: 'Lorem Ipsum',
        poster_path: '/abc.jpg',
        release_date: '2026-07-01',
        vote_average: 8.88,
      },
    ],
  };

  const fakeGenres = {
    genres: [
      { id: 1, name: 'Adventure' },
      { id: 8, name: 'Action' },
    ],
  };

  const fakeCredits = {
    cast: Array.from({ length: 15 }, (_, i) => ({
      id: i,
      name: `Actor ${i}`,
      character: `Character ${i}`,
      profile_path: null,
    })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovieApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and map popular movies', () => {
    let result: MoviePage | undefined;
    service.getPopular().subscribe((r) => (result = r));
    const req = httpMock.expectOne((r) => r.url.includes('/movie/popular'));

    expect(req.request.method).toBe('GET');

    req.flush(fakeResponse);

    expect(result!.movies.length).toBe(1);

    const movie = result!.movies[0];
    expect(movie.releaseYear).toBe('2026');
    expect(movie.rating).toBe(8.9);
    expect(movie.title).toBe('Test Movie');
    expect(movie.posterUrl).toContain('/abc.jpg');

    expect(result!.totalPages).toBe(10);
  });

  it('should search for matrix movie', () => {
    let result: MoviePage | undefined;
    service.searchMovies('matrix').subscribe((r) => (result = r));
    const req = httpMock.expectOne((r) => r.url.includes('/search/movie'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('query')).toBe('matrix');
    expect(req.request.params.get('page')).toBe('1');

    req.flush(fakeResponse);
    expect(result!.movies.length).toBe(1);
    expect(result!.movies[0].title).toBe('Test Movie');
  });

  it('should discover movies', () => {
    let result: MoviePage | undefined;

    service.discoverMovies(8).subscribe((res) => (result = res));
    const req = httpMock.expectOne((r) => r.url.includes('/discover/movie'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('with_genres')).toBe('8');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('sort_by')).toBe('popularity.desc');

    req.flush(fakeResponse);
    expect(result!.movies.length).toBe(1);
    expect(result!.movies[0].title).toBe('Test Movie');
  });

  it('should get movie genres', () => {
    let result: Genre[] | undefined;
    service.getGenres().subscribe((res) => (result = res));
    const req = httpMock.expectOne((r) => r.url.includes('/genre/movie/list'));
    expect(req.request.method).toBe('GET');

    req.flush(fakeGenres);
    expect(result!.length).toBe(2);
    expect(result![0].name).toBe('Adventure');
  });

  it('should get movie credits', () => {
    let result: CastMember[] | undefined;
    service.getMovieCredits(8).subscribe((res) => (result = res));
    const req = httpMock.expectOne((r) => r.url.includes('/movie/8/credits'));
    expect(req.request.method).toBe('GET');

    req.flush(fakeCredits);
    expect(result!.length).toBe(10);
    expect(result![0].name).toBe('Actor 0');
    expect(result![0].character).toBe('Character 0');
    expect(result![0].profileUrl).toBeNull();
  });
});
