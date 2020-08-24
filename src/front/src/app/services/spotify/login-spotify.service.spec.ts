import { TestBed } from '@angular/core/testing';

import { LoginSpotifyService } from './login-spotify.service';

describe('LoginSpotifyService', () => {
  let service: LoginSpotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSpotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
