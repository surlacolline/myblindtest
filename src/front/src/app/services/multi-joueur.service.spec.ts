import { TestBed } from '@angular/core/testing';

import { MultiJoueurService } from './multi-joueur.service';

describe('MultiJoueurService', () => {
  let service: MultiJoueurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiJoueurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
