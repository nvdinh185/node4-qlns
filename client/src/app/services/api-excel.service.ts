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
        // console.log(data);
        let row = ws.getRow(2);
        row.getCell("A").value = data[0].name;
        row.getCell("E").value = data[0].id;

        // Xác định bề rộng cho các cột
        ws.getColumn(1).width = 5;
        ws.getColumn(2).alignment = { wrapText: true };
        ws.getColumn(4).alignment = { wrapText: true };

        let index = 0;
        data[0].subs.forEach(el => {
          row = ws.getRow(index + 4);
          row.getCell(config.noId.value).value = index + 1;
          row.getCell(config.name.value).value = el.name;
          row.getCell(config.short_name.value).value = el.short_name;
          row.getCell(config.description.value).value = el.description;
          row.getCell(config.id.value).value = el.id;
          row.getCell(config.parent_id.value).value = el.parent_id;
          index++;
        });

        resolve({ status: "OK", count: index });
      } catch (e) {
        console.log(e);
        reject({ status: "NOK", error: e });
      }
    })
  }
}
