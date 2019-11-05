# NgxExcelTemplate
  excel file template 
  It organizes your excel files that you have prepared as template.
  
  edit {name} as key and value

## usage
 ```
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
```

## Build

Run `ng build ngx-excel-template` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ngx-excel-template`, go to the dist folder `cd dist/ngx-excel-template` and run `npm publish`.

## Running unit tests

Run `ng test ngx-excel-template` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
