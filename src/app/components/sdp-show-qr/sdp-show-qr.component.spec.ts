/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SdpShowQrComponent } from './sdp-show-qr.component';

describe('SdpShowQrComponent', () => {
  let component: SdpShowQrComponent;
  let fixture: ComponentFixture<SdpShowQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdpShowQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdpShowQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
