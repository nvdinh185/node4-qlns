import { Injectable } from '@angular/core';
import { CommonsService, AuthService } from 'ngxi4-dynamic-service';

import * as Excel from "exceljs";  // excel tạo có format
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
    // đọc file template từ url trả về dạng blob
    this.apiAuth.getDynamicUrl(urlTemplateFile, '', { responseType: 'blob' })
      .then(blobData => {
        // console.log(blobData);
        // Khai báo mảng dữ liệu giả lập object 
        // sử dụng phương pháp splice để thêm dữ liệu cho mảng
        // thì multithread sẽ cho phép ở hàm delay thay đổi được
        let arrayOutput = []; // giả lập mảng để splice trả hàm delay
        let fr = new FileReader();
        // // đọc dữ liệu blob thành mảng bộ đệm để load vào excel
        fr.readAsArrayBuffer(blobData);
        // // khi load thành công sẽ sinh ra sự kiện này
        fr.onloadend = (e) => {
          let bufferData: any = fr.result;
          let wb = new Excel.Workbook();
          wb.xlsx.load(bufferData)
            .then(async workbook => {
              // console.log(bufferData)
              workbook.eachSheet(async (sheet, id) => {
                // sử dụng tên sheet bản đồ chiến lược để load vào csdl
                if (sheet.name === sheet_name) {
                  try {
                    let ws: Excel.Worksheet = sheet;
                    // console.log(ws);
                    // gọi các thủ tục xử lý dữ liệu ở đây
                    // Đồng thời ghi xuống ws theo từng nghiệp vụ riêng lẻ theo config
                    let resultCallback = await callbackPromise(ws, config);
                    // ***> kích hoạt kết quả xử lý xong để thoát khỏi delay nhanh hơn
                    arrayOutput.splice(arrayOutput.length, 0, resultCallback)
                  } catch (e) {
                    console.log('Lỗi xử lý dữ liệu', e);
                  }
                }
              })
              // đợi có kết quả hoặc sau thời gian delay sẽ đi tiếp
              await this.apiCommon.delay(delayMilis || 5000, arrayOutput)
              // ghi file ra sau khi bổ sung dữ liệu trong template nhé
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
