/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignalingService } from './signaling.service';

describe('Service: Signaling', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalingService]
    });
  });

  it('should ...', inject([SignalingService], (service: SignalingService) => {
    expect(service).toBeTruthy();
  }));
});
