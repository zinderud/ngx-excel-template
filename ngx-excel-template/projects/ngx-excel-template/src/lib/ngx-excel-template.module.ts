import { NgModule } from '@angular/core';
import { NgxExcelTemplateComponent } from './ngx-excel-template.component';
import { NgxExcelTemplateService } from './ngx-excel-template.service';



@NgModule({
  declarations: [NgxExcelTemplateComponent],
  imports: [
  ],
  exports: [NgxExcelTemplateComponent],
  providers: [{provide: NgxExcelTemplateService, useClass: NgxExcelTemplateService}]
})
export class NgxExcelTemplateModule { }
