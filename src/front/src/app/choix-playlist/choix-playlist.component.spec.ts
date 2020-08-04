import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixPlaylistComponent } from './choix-playlist.component';

describe('ChoixPlaylistComponent', () => {
  let component: ChoixPlaylistComponent;
  let fixture: ComponentFixture<ChoixPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChoixPlaylistComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoixPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
