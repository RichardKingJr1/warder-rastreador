import { TestBed } from '@angular/core/testing';

import { MinimizadoService } from './minimizado.service';

describe('MinimizadoService', () => {
  let service: MinimizadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinimizadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
