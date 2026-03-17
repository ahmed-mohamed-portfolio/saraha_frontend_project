import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkilatonComponent } from './skilaton.component';

describe('SkilatonComponent', () => {
  let component: SkilatonComponent;
  let fixture: ComponentFixture<SkilatonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkilatonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkilatonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
