/**
 * Tao database sqlite from excel
 * file nay chay mot lan bang tay khi muon tao mot csdl bang file exel
 * Thuc hien doc cau truc file excel roi tao database ban dau
 * sau do cac service se lay de handle db sau
 */

const excel_db = require('./db/sqlite3/excel-2-sqlite');

const excelFilename = "./db/excel/qlns-database-v1.xlsx";  //ten file excel cau hinh
const dbFilename = "./db/database/qlns-database-v1.db";     //ten database muon tao

//xoa file csdl cu neu co
//xoa file csdl cu neu co
const fs = require('fs');
try {
    if (fs.existsSync(dbFilename)) fs.unlinkSync(dbFilename);
    console.error("Xoa file cu thanh cong");
} catch (err) {
    console.error("Loi xoa file", err);
}

excel_db(dbFilename, excelFilename);