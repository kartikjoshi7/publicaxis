import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycRadar } from './kyc-radar';

describe('KycRadar', () => {
  let component: KycRadar;
  let fixture: ComponentFixture<KycRadar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycRadar],
    }).compileComponents();

    fixture = TestBed.createComponent(KycRadar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
