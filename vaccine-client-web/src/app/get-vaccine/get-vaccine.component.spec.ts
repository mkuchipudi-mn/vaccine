import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetVaccineComponent } from './get-vaccine.component';

describe('GetVaccineComponent', () => {
  let component: GetVaccineComponent;
  let fixture: ComponentFixture<GetVaccineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetVaccineComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
