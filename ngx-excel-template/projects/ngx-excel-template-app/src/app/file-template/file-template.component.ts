import { Component, OnInit } from '@angular/core';
import { NgxExcelTemplateService } from 'projects/ngx-excel-template/src/lib/ngx-excel-template.service';
interface KeyValuePair {
  key: string;
  value: string;
}

@Component({
  selector: 'app-file-template',
  templateUrl: './file-template.component.html',
  styleUrls: ['./file-template.component.scss']
})
export class FileTemplateComponent implements OnInit {
  filepath = 'assets/test.xlsx';
  constructor(  private excelService: NgxExcelTemplateService) { }

  ngOnInit() {
  }
  getFile() {

    this.excelService.exportExcel(this.filepath, 'filename.xlsx', 'Seetname', this.setvalues() );
  }

  setvalues(): KeyValuePair[] {
     const data: KeyValuePair[] = [
       { key: 'name', value: 'John' },
       { key: 'age', value: '123' },

      ];
     return data;

  }
}
