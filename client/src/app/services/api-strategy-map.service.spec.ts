import { TestBed } from '@angular/core/testing';

import { ApiStrategyMapService } from './api-strategy-map.service';

describe('ApiStrategyMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiStrategyMapService = TestBed.get(ApiStrategyMapService);
    expect(service).toBeTruthy();
  });
});
