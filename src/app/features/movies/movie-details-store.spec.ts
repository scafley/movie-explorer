import { TestBed } from '@angular/core/testing';

import { MovieDetailsStore } from './movie-details-store';

describe('MovieDetailsStore', () => {
  let service: MovieDetailsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieDetailsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
