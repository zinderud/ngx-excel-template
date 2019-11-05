import { TestBed } from '@angular/core/testing';

import { NgxExcelTemplateService } from './ngx-excel-template.service';

describe('NgxExcelTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxExcelTemplateService = TestBed.get(NgxExcelTemplateService);
    expect(service).toBeTruthy();
  });
});
