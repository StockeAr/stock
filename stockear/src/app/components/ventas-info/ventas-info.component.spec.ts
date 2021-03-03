import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasInfoComponent } from './ventas-info.component';

describe('VentasInfoComponent', () => {
  let component: VentasInfoComponent;
  let fixture: ComponentFixture<VentasInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
