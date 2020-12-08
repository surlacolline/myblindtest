import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPseudoDialogComponent } from './add-pseudo-dialog.component';

describe('AddPseudoDialogComponent', () => {
  let component: AddPseudoDialogComponent;
  let fixture: ComponentFixture<AddPseudoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPseudoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPseudoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
