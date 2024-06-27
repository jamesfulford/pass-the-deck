import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickerPageComponent } from './picker-page.component';

describe('PickerPageComponent', () => {
  let component: PickerPageComponent;
  let fixture: ComponentFixture<PickerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
