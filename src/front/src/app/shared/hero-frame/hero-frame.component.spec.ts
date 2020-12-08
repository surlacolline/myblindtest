import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFrameComponent } from './hero-frame.component';

describe('HeroFrameComponent', () => {
  let component: HeroFrameComponent;
  let fixture: ComponentFixture<HeroFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
