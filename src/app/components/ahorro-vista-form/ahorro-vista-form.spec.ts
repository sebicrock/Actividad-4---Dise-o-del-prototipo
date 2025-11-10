import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhorroVistaForm } from './ahorro-vista-form';

describe('AhorroVistaForm', () => {
  let component: AhorroVistaForm;
  let fixture: ComponentFixture<AhorroVistaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AhorroVistaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AhorroVistaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
