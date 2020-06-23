import { Injectable } from '@angular/core';

import * as Excel from "exceljs";
@Injectable({
  providedIn: 'root'
})
export class ApiStrategyMapService {

  constructor() { }

  processStrategyDinh(data: object, ws: Excel.Worksheet, config: any) {
    return new Promise((resolve, reject) => {
      try {

        let row = ws.getRow(1);
        row.getCell("B").value = data[0].name;

        data[0].subs.forEach((el, idx) => {
          // console.log(el);
          row = ws.getRow(idx + 4);
          row.getCell(config.id.value).value = el.id;
          row.getCell(config.name.value).value = el.name;
          row.getCell(config.description.value).value = el.description;
          row.getCell(config.short_name.value).value = el.short_name;
          row.getCell(config.created_time.value).value = el.created_time;
          row.getCell(config.updated_time.value).value = el.updated_time;
        });

        resolve({ status: "OK", count: 1 })
      } catch (e) {
        console.log(e);
        reject({ status: "NOK", error: e })
      }
    })
  }
}
