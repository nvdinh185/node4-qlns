import { TestBed } from '@angular/core/testing';

import { ApiDownloadService } from './api-download.service';

describe('ApiDownloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiDownloadService = TestBed.get(ApiDownloadService);
    expect(service).toBeTruthy();
  });
});
