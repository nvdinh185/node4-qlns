import { Injectable } from '@angular/core';
import { CommonsService, AuthService } from 'ngxi4-dynamic-service';

import * as Excel from "exceljs";
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ApiDownloadService {

  constructor(
    private apiAuth: AuthService,
    private apiCommon: CommonsService
  ) { }

  processFileDownload(
    urlTemplateFile: string
    , sheet_name: string
    , file_name: string
    , config: any
    , callbackPromise: (worksheet: Excel.Worksheet, config: any) => { status: string, message: string, count: number } | { status: string, error: any }
    , delayMilis?: number) {
    this.apiAuth.getDynamicUrl(urlTemplateFile, '', { responseType: 'blob' })
      .then(blobData => {
        // console.log(blobData);
        let arrayOutput = [];
        let fr = new FileReader();
        fr.readAsArrayBuffer(blobData);
        fr.onloadend = () => {
          let bufferData: any = fr.result;
          let wb = new Excel.Workbook();
          wb.xlsx.load(bufferData)
            .then(async workbook => {
              // console.log(bufferData)
              workbook.eachSheet(async (sheet) => {
                if (sheet.name === sheet_name) {
                  try {
                    let ws: Excel.Worksheet = sheet;
                    let resultCallback = await callbackPromise(ws, config);
                    arrayOutput.splice(arrayOutput.length, 0, resultCallback)
                  } catch (e) {
                    console.log('Lỗi xử lý dữ liệu', e);
                  }
                }
              })
              await this.apiCommon.delay(delayMilis || 5000, arrayOutput)
              // console.log(arrayOutput);
              if (arrayOutput.length > 0 && arrayOutput[0].status === "OK" && arrayOutput[0].count > 0) {
                workbook.xlsx.writeBuffer().then((data) => {
                  let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  fs.saveAs(blob, `${file_name}-${sheet_name}-${Date.now()}.xlsx`);
                })
              }
            })
            .catch(err => {
              console.log('Lỗi đọc dữ liệu blob', err);
            })
        };
      })
      .catch(err => {
        console.log('Lỗi lấy file mẫu từ API', err);
      })
  }
}
