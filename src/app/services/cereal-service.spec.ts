import { TestBed } from '@angular/core/testing';

import { CerealService } from './cereal-service';

describe('CerealService', () => {
  let service: CerealService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CerealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
