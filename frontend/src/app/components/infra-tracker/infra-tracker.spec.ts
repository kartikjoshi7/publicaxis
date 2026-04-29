import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfraTracker } from './infra-tracker';

describe('InfraTracker', () => {
  let component: InfraTracker;
  let fixture: ComponentFixture<InfraTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfraTracker],
    }).compileComponents();

    fixture = TestBed.createComponent(InfraTracker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
