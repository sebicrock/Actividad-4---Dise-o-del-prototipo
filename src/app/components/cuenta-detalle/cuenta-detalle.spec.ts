import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaDetalle } from './cuenta-detalle';

describe('CuentaDetalle', () => {
  let component: CuentaDetalle;
  let fixture: ComponentFixture<CuentaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
