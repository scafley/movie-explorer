import { TestBed } from '@angular/core/testing';

import { FavoritesStore } from './favorites-store';
import { Movie } from './movie.models';

describe('FavoritesStore', () => {
  let service: FavoritesStore;

  const movie: Movie = {
    id: 1,
    title: 'Title',
    overview: 'Lorem ipsum',
    posterUrl: null,
    releaseYear: '2026',
    rating: 8.88,
  };

  beforeEach(() => {
    let store: Record<string, string> = {};
    const localStorageMock = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    vi.stubGlobal('localStorage', localStorageMock);
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a movie to the favorites when toggled', () => {
    let result: Movie[] = [];
    service.favoritesList$.subscribe((movies) => (result = movies));
    service.toggle(movie);

    expect(result.length).toBe(1);
  });

  it('should remove a movie from the favorites', () => {
    let result: Movie[] = [];
    service.favoritesList$.subscribe((movies) => (result = movies));
    service.toggle(movie);
    expect(result.length).toBe(1);
    service.toggle(movie);
    expect(result.length).toBe(0);
  });

  it('isFavorite returns true when movie is in fav list', () => {
    let isFav: boolean;
    service.isFavorite(movie.id).subscribe((v) => (isFav = v));
    service.toggle(movie);
    expect(isFav!).toBe(true);
  });

  it('isFavorite returns false when movie is not in fav list', () => {
    let isFav: boolean;
    service.isFavorite(movie.id).subscribe((v) => (isFav = v));
    expect(isFav!).toBe(false);
  });
});
