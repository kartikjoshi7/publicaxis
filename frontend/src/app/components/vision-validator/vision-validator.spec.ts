import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionValidator } from './vision-validator';

describe('VisionValidator', () => {
  let component: VisionValidator;
  let fixture: ComponentFixture<VisionValidator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisionValidator],
    }).compileComponents();

    fixture = TestBed.createComponent(VisionValidator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
