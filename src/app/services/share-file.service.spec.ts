/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShareFileService } from './share-file.service';

describe('Service: ShareFile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareFileService]
    });
  });

  it('should ...', inject([ShareFileService], (service: ShareFileService) => {
    expect(service).toBeTruthy();
  }));
});
