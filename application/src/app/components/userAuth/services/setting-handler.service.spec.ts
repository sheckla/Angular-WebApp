import { TestBed } from '@angular/core/testing';

import { SettingHandlerService } from './setting-handler.service';

describe('SettingHandlerService', () => {
  let service: SettingHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
