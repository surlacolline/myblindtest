import { TestBed } from '@angular/core/testing';

import { ShowInfoPopupService } from './show-info-popup.service';

describe('ShowInfoPopupService', () => {
  let service: ShowInfoPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowInfoPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
