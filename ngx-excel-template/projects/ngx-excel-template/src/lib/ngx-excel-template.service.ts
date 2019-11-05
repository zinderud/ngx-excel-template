import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

import { utils, write, writeFile, read, readFile, WorkBook, WorkSheet, ColInfo } from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
interface KeyValuePair {
  key: string;
  value: string;
}
@Injectable({
  providedIn: 'root',

})
export class NgxExcelTemplateService {
  filepath = 'assets/test.xlsx';
  private workbook$ = new BehaviorSubject<WorkBook>({ SheetNames: [], Sheets: {} });
  // workbook: WorkBook;
  constructor(private http: HttpClient) { }





  public exportExcel(filepath: string, fileName: string, wsName: string, kv: KeyValuePair[]) {
    this.http.get(this.filepath, { responseType: 'blob' }).subscribe(data => {
      const k = this.xlsAssetBlobToJSON(data).then(x => {

        this.workbook$.next(x);

        kv.forEach(el => {
          this.set(el.key, el.value);
        });

        let k = this.BlobToJSON();
        this.jsonToSheetExport(fileName, wsName, k);

      }).catch((error) => {

      });
    },
      error => {
        console.log(error);
      });



  }

  /**
   * Convert a Assetfile data into a WorkBook Object.
   * @param data Assetfile excel data to convert.
   */
  public xlsAssetBlobToJSON(data: any): Promise<any> {

    return new Promise((resolve, reject) => {
      // Set the BLOB data reader
      const reader = new FileReader();

      // Processing readed data
      reader.onload = (e: any) => {
        // Create the array buffer
        // const u8 = new Uint8Array(reader.result);
        const bstr: string = e.target.result;
        // Create the WorkBook reading the buffer
        const wb: WorkBook = read(bstr, { type: 'array' });


        resolve(wb);
      };

      // Read blob array buffer
      reader.readAsArrayBuffer(data);
    });
  }


  public BlobToJSON() {



    console.log("ws", this.workbook$.value)

    let value = this.workbook$.value
    // Get the WorkSheet name
    const wsname: string = value.SheetNames[0];

    // Get the WorkSheet n
    const ws: WorkSheet = value.Sheets[wsname];

    console.log("ws", wsname)
    // Get object properties
    const propArray = this.getCellsReference(ws);

    // Get last range element
    const lastElem = propArray[propArray.length - 1];

    // Set the range to read all the cell
    const range: string = 'A1:' + lastElem;

    // Convert the sheet into a JSON Object
    const xlsData = utils.sheet_to_json(ws, { range, header: 1 });
    return xlsData;



  }

  /**
   * Returns a string array that represents the coordinates of all the cell with data.
   * @param ws WorkSheet.
   */
  private getCellsReference(ws: WorkSheet): string[] {
    // Get object properties
    let propArray = Object.getOwnPropertyNames(ws);

    // Exlude the "!" properties
    propArray = propArray.filter(f => !f.match('!'));

    return propArray;
  }

  public set(name: string, value: any) {
    console.log('burda');
    if (Array.isArray(value)) {
      if (value.length === 0) {
        console.log('burda1');
        return;
      }
      for (const sheetName of this.workbook$.value.SheetNames) {

        const sheet = this.workbook$.value.Sheets[sheetName];
        const targetRowIndex = this.findRowIndex(name, sheet);
        console.log('burda2');
        if (targetRowIndex >= 0) {
          const ref = sheet['!ref'];
          console.log('burda3');
          if (ref) {
            console.log('burda4');
            const [leftRange, rightRange] = ref.split(':');
            const { column: maxColumnName, rowIndex: maxRowCount } = this.parseCellName(rightRange);
            const newMaxRowCount = maxRowCount + value.length;
            if (maxRowCount >= 0) {
              sheet['!ref'] = `${leftRange}:${maxColumnName}${newMaxRowCount}`;
            }
          }

          for (const cellName in sheet) {
            if (sheet.hasOwnProperty(cellName) && cellName.indexOf('!') !== 0) {
              console.log('burda5');
              const { column, rowIndex } = this.parseCellName(cellName);
              const cell: XLSX.CellObject = sheet[cellName];
              if (rowIndex === targetRowIndex && cell.w) {
                const index = cell.w.indexOf(`{${name}.`);
                if (index >= 0) {
                  console.log('burda6');
                  let fieldName: string | undefined;
                  for (let i = index + `{${name}.`.length; i < cell.w.length; i++) {
                    if (cell.w[i] === '}') {
                      fieldName = cell.w.substring(index + `{${name}.`.length, i);
                      break;
                    }
                  }
                  if (fieldName) {
                    for (let i = 1; i < value.length; i++) {
                      console.log('burda7');
                      sheet[column + (rowIndex + i)] = JSON.parse(JSON.stringify(sheet[cellName]));
                    }
                    for (let i = 0; i < value.length; i++) {
                      const newCell: XLSX.CellObject = sheet[column + (rowIndex + i)];
                      this.setCell(newCell, `{${name}.${fieldName}}`, value[i][fieldName]);
                    }
                  }
                }
              }
            }
          }

          return;
        }
      }
    } else {
      for (const sheetName of this.workbook$.value.SheetNames) {
        console.log('bb');
        const sheet = this.workbook$.value.Sheets[sheetName];
        for (const cellName in sheet) {
          if (sheet.hasOwnProperty(cellName) && cellName.indexOf('!') !== 0) {
            const cell: XLSX.CellObject = sheet[cellName];
            this.setCell(cell, `{${name}}`, value);
            console.log('bb');
          }
        }
      }
    }
  }

  private setCell(cell: XLSX.CellObject, name: string, value: any) {
    if (cell.v && typeof cell.v === 'string' && cell.v.indexOf(name) >= 0) {
      cell.v = cell.v === name ? value : cell.v.split(name).join(value);
      if (typeof cell.v === 'number') {
        cell.t = 'n';
      } else if (Object.prototype.toString.call(cell.v) === '[object Date]') {
        cell.t = 'd';
      } else if (cell.v === true || cell.v === false) {
        cell.t = 'b';
      }
    }
  }

  private parseCellName(cellName: string) {
    for (let i = 0; i < cellName.length; i++) {
      if (!isNaN(+cellName[i])) {
        return {
          column: cellName.substring(0, i),
          rowIndex: +cellName.substring(i)
        };
      }
    }
    return {
      column: '',
      rowIndex: -1
    };
  }

  private findRowIndex(name: string, sheet: XLSX.WorkSheet) {
    for (const cellName in sheet) {
      if (sheet.hasOwnProperty(cellName) && cellName.indexOf('!') !== 0) {
        const cell: XLSX.CellObject = sheet[cellName];
        if (cell.w && cell.w.indexOf(`{${name}.`) >= 0) {
          const { rowIndex } = this.parseCellName(cellName);
          return rowIndex;
        }
      }
    }
    return -1;
  }


  public jsonToSheetExport(fileName: string, wsName: string, data: any) {
    // WorkBook creation
    const wb: WorkBook = { SheetNames: [], Sheets: {} };

    // Convert JSON dato to WorkSheet
    const ws: WorkSheet = utils.json_to_sheet(data);

    // Add WorkSheet to the list
    wb.SheetNames.push(wsName);

    // Set the WorkSheet
    wb.Sheets[wsName] = ws;

    // Write file
    writeFile(wb, fileName, { bookSST: true });
  }


}
