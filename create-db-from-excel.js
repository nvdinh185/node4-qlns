const excel_db = require('./db/sqlite3/excel-2-sqlite');

const excelFilename = "./db/excel/kpi-bsc-database-v1.xlsx";  //ten file excel cau hinh
const dbFilename = "./db/database/kpi-bsc-database-v1.db";     //ten database muon tao

const fs = require('fs');
//xoa file csdl cu neu co
try {
    if (fs.existsSync(dbFilename)) {
        fs.unlinkSync(dbFilename);
        console.error("Xoa file cu thanh cong");
    }
    excel_db(dbFilename, excelFilename);
} catch (err) {
    console.error("Loi xoa file", err);
}