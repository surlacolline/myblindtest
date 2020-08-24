import { TestBed } from '@angular/core/testing';

import { TryValueService } from './try-value.service';

describe('TryValueService', () => {
  let service: TryValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TryValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
