import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisinfoSentinel } from './misinfo-sentinel';

describe('MisinfoSentinel', () => {
  let component: MisinfoSentinel;
  let fixture: ComponentFixture<MisinfoSentinel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisinfoSentinel],
    }).compileComponents();

    fixture = TestBed.createComponent(MisinfoSentinel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
