/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SdpReadQrComponent } from './sdp-read-qr.component';

describe('SdpReadQrComponent', () => {
  let component: SdpReadQrComponent;
  let fixture: ComponentFixture<SdpReadQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdpReadQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdpReadQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
