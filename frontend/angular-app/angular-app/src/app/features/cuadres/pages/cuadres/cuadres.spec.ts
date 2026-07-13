import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cuadres } from './cuadres';

describe('Cuadres', () => {
  let component: Cuadres;
  let fixture: ComponentFixture<Cuadres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cuadres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cuadres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
