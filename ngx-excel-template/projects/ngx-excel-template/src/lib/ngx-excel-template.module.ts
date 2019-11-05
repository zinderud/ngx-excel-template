import { NgModule } from '@angular/core';
import { NgxExcelTemplateComponent } from './ngx-excel-template.component';
import { NgxExcelTemplateService } from './ngx-excel-template.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [NgxExcelTemplateComponent],
  imports: [ CommonModule,
    HttpClientModule,
  ],
  exports: [NgxExcelTemplateComponent],
  providers: [{provide: NgxExcelTemplateService, useClass: NgxExcelTemplateService}]
})

export class NgxExcelTemplateModule {
  static forRoot() {
    return {
      ngModule: NgxExcelTemplateModule,
      providers: [{provide: NgxExcelTemplateService, useClass: NgxExcelTemplateService}]
    };
  }
}


