import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaEmpleadosComponent } from './venta-empleados.component';

describe('VentaEmpleadosComponent', () => {
  let component: VentaEmpleadosComponent;
  let fixture: ComponentFixture<VentaEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentaEmpleadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
