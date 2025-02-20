import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEscuelasComponent } from './editar-escuelas.component';

describe('EditarEscuelasComponent', () => {
  let component: EditarEscuelasComponent;
  let fixture: ComponentFixture<EditarEscuelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEscuelasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEscuelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
