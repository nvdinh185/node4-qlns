import { Injectable } from '@angular/core';

import * as Excel from "exceljs";
@Injectable({
  providedIn: 'root'
})
export class ApiExcelService {

  constructor() { }

  processWriteExcel(data: any, ws: Excel.Worksheet, config: any) {
    return new Promise((resolve, reject) => {
      try {

        let row = ws.getRow(1);
        row.getCell("B").value = data[0].name;
        
        let index = 0;
        data[0].subs.forEach((el, idx) => {
          // console.log(el);
          index++;
          row = ws.getRow(idx + 4);
          row.getCell(config.noId.value).value = idx + 1;
          row.getCell(config.name.value).value = el.name;
          row.getCell(config.id.value).value = el.id;
        });

        resolve({ status: "OK", count: index })
      } catch (e) {
        console.log(e);
        reject({ status: "NOK", error: e })
      }
    })
  }
}
