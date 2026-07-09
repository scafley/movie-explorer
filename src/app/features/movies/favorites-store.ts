import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable, skip } from 'rxjs';
import { Movie } from './movie.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const STORAGE_KEY = 'favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesStore {
  private readonly favorites$ = new BehaviorSubject<Movie[]>(this.loadFromStorage());
  readonly favoritesList$ = this.favorites$.asObservable();

  constructor() {
    this.favorites$
      .pipe(skip(1), takeUntilDestroyed())
      .subscribe((movies) => this.saveToStorage(movies));
  }

  isFavorite(id: number): Observable<boolean> {
    return this.favorites$.pipe(
      map((movies) => movies.some((m) => m.id === id)),
      distinctUntilChanged(),
    );
  }

  toggle(movie: Movie): void {
    const current = this.favorites$.value;
    const exist = current.some((m) => m.id === movie.id);

    const updated = exist ? current.filter((m) => m.id !== movie.id) : [...current, movie];

    this.favorites$.next(updated);
  }

  private loadFromStorage(): Movie[] {
    try {
      const favRaw = localStorage.getItem(STORAGE_KEY);
      if (!favRaw) return [];

      return JSON.parse(favRaw) as Movie[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private saveToStorage(movies: Movie[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }
}
