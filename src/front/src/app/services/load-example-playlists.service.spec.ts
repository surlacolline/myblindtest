import { TestBed } from '@angular/core/testing';

import { LoadExamplePlaylistsService } from './load-example-playlists.service';

describe('LoadExamplePlaylistsService', () => {
  let service: LoadExamplePlaylistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadExamplePlaylistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
