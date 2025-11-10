import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAhorroProgramado } from './crear-ahorro-programado';

describe('CrearAhorroProgramado', () => {
  let component: CrearAhorroProgramado;
  let fixture: ComponentFixture<CrearAhorroProgramado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearAhorroProgramado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearAhorroProgramado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
