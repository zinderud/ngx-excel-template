import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxExcelTemplateComponent } from './ngx-excel-template.component';

describe('NgxExcelTemplateComponent', () => {
  let component: NgxExcelTemplateComponent;
  let fixture: ComponentFixture<NgxExcelTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxExcelTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxExcelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
