import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasEmpleadosComponent } from './ventas-empleados.component';

describe('VentasEmpleadosComponent', () => {
  let component: VentasEmpleadosComponent;
  let fixture: ComponentFixture<VentasEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasEmpleadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});