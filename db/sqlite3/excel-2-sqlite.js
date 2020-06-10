/**
 * ver 2.0 Sử dụng DAO ver 3.3 trở lên
 * Chuyển đổi đọc excel 1 loại thôi
 * 02/10/2019 - Thay thế cho excel-sqlite-service.js
 * 
 * Nhiệm vụ: Đọc file excel:
 * create table trong db và insert vào sqlite DB
 * 
 * Có log rõ ràng dữ liệu được tạo, số lượng bảng ghi...
 * 
 */
const SQLiteDAO = require('./sqlite-dao');
const xlsxtojson1st = require("xlsx-to-json-lc");
const fs = require('fs');

const Excel2Sqlite = (dbFilename, excelFilename) => {
    // tạo csdl 
    // Tạo csdl mới
    let db = new SQLiteDAO(dbFilename);
    setTimeout(() => {
        if (fs.existsSync(dbFilename)) {
            console.log('Database ' + dbFilename + ' ready!');
            readExcelCreateTables(db, excelFilename);
        } else {
            console.log('No Database Sqlite' + dbFilename)
        }
    }, 1000);

}

const readExcelCreateTables = (db, excelFilename) =>
    // Đọc dữ liệu từ file excel
    xlsxtojson1st({
        input: excelFilename,   // tên file cần lấy dữ liệu excel .xlsx 
        sheet: "tables",        // Tên bảng cần lấy dữ liệu
        output: null,           // since we don't need output.json
        lowerCaseHeaders: true  // converts excel header rows into lowercase as json keys
    }, (err, results) => {
        if (err) {
            console.log('Lỗi đọc file excel:', err);
        } else {
            // Lấy kết quả đọc này tạo thành bảng dữ liệu
            db.createTables(results)
                .then(tablesCreated => {
                    console.log('Các bảng được tạo là', tablesCreated);
                    //đọc lần lượt các bảng có tên trong tablesCreated trong file excel nếu có
                    tablesCreated.forEach(tableName => {
                        readExcelInsertDatas(db, excelFilename, tableName);
                    });
                });
            //sau khi tạo xong bảng (do nó chạy kiểu async nên phải đợi xong)
        }
    });

const readExcelInsertDatas = (db, excelFilename, tableName) =>
    xlsxtojson1st({
        input: excelFilename,   // tên file cần lấy dữ liệu excel .xlsx 
        sheet: tableName,        // Tên bảng cần lấy dữ liệu
        output: null,           // since we don't need output.json
        lowerCaseHeaders: true  // converts excel header rows into lowercase as json keys
    }, (err, results) => {
        if (err) {
            console.log('Lỗi đọc file excel:', err);
        } else {
            // console.log('kq', tableName, results[0]);
            // Chuyen doi du lieu '' = null de khong update vao nhe
            let jsonStr = JSON.stringify(results,
                (key, value) => {
                    if (value === null || value === '') { return undefined; }
                    return value;
                },
                2);
            // Loại bỏ các cell='' thành null hoặc undefined 
            let json = JSON.parse(jsonStr);

            db.insertTableData(tableName, json)
                .then(data => {
                    console.log('insert Data to: ', tableName, data);
                })

        }
    });

module.exports = Excel2Sqlite;