import { TestBed } from '@angular/core/testing';

import { MovieStore } from './movie-store';

describe('MovieStore', () => {
  let service: MovieStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
