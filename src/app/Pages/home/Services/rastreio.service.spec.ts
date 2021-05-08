import { TestBed } from '@angular/core/testing';

import { RastreioService } from './rastreio.service';

describe('RastreioService', () => {
  let service: RastreioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RastreioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
