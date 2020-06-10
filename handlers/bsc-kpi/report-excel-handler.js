"use strict"
/**
 * Bộ xử lý report excel
 */
const delay = require('delay');
const fs = require('fs');
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');
var Excel = require('exceljs');
var workbook = new Excel.Workbook();

const dirReport = 'user-outputs';
if (!fs.existsSync(dirReport)) fs.mkdirSync(dirReport);

/**
 * Tạo file report excel
 * Dữ liệu vào là mảng dữ liệu để ghi file excel
 * Tên tổ chức/công ty
 * Chu kỳ báo cáo
 * Tên file excel muốn tạo
 * @param {*} arr 
 * @param {*} organizationName 
 * @param {*} reportName 
 * @param {*} outputFilename 
 */
const createExcelMap = (arr, organizationName, reportName, outputFilename) => {
    return new Promise((resolve, reject) => {
        if (arr.length > 0) {
            //xử lý hình cây
            // console.log('x');
            let arrTreeOrder = arrObj.createTreeOrder(arr, 'id', 'parent_id');
            workbook.xlsx.readFile(outputFilename)
                .then(async () => {
                    // console.log('1');
                    var worksheet = workbook.getWorksheet('report-excel');
                    var row;
                    //ghi tiêu đề cho bảng
                    row = worksheet.getRow(1);
                    row.getCell(2).value = 'BẢNG ĐÁNH GIÁ Kết quả thực hiện: CHIẾN LƯỢC';
                    worksheet.mergeCells('B1:I1');
                    row = worksheet.getRow(2);
                    row.getCell(2).value = organizationName;
                    worksheet.mergeCells('B2:I2');
                    row = worksheet.getRow(3);
                    row.getCell(2).value = 'Kỳ đánh giá: ' + reportName;
                    worksheet.mergeCells('B3:I3');
                    //các biến tính tổng
                    var lastRow, root_weight_percent = 0, total_effective = 0;
                    //ghi dữ liệu vào nội dung của bảng
                    // arrTreeOrder.forEach((el, idx) => {
                    for (let idx = 0; idx < arrTreeOrder.length; idx++) {
                        let el = arrTreeOrder[idx];
                        row = worksheet.getRow(idx + 6);
                        row.getCell(1).value = el.$tree_index
                        row.getCell(2).value = el.$level === 1 ? el.name.toUpperCase() : el.name
                        row.getCell(3).value = Math.round(el.root_weight_percent * 100) + '%'
                        row.getCell(4).value = el.unit
                        row.getCell(5).value = el.operator_method
                        row.getCell(6).value = el.unit == '%' ? Math.round(el.target * 100) + '%' : el.target
                        row.getCell(7).value = el.unit == '%' ? Math.round(el.target_limit * 100) + '%' : el.target_limit
                        row.getCell(8).value = el.unit == '%' ? Math.round(el.result * 100) + '%' : el.result
                        row.getCell(9).value = Math.round(el.result_effective * 100) + '%'
                        row.getCell(10).value = Math.round(el.total_effective * 100) + '%'
                        //Kẻ khung, in đậm và tô màu nền
                        row.eachCell({ includeEmpty: true }, cell => {
                            if (el.$level === 1) {
                                cellFormat(cell)
                            }
                            cellBorder(cell)
                        });
                        el.$is_leaf === 1 ? root_weight_percent += el.root_weight_percent : '';
                        el.$is_leaf === 1 ? total_effective += el.total_effective : '';
                        lastRow = idx + 6;
                    }
                    // console.log('2');
                    //ghi tổng kết
                    row = worksheet.getRow(lastRow + 1);
                    row.getCell(2).value = "TỔNG CỘNG";
                    row.getCell(3).value = Math.round(root_weight_percent * 100) + '%';
                    row.getCell(10).value = Math.round(total_effective * 100) + '%';
                    //Kẻ khung, in đậm và tô màu nền
                    row.eachCell({ includeEmpty: true }, cell => {
                        cellFormat(cell)
                        cellBorder(cell)
                    });
                    await workbook.xlsx.writeFile(outputFilename);
                    resolve()
                })
                .catch(err => {
                    //Lỗi trong quá trình ghi file excel
                    // console.log('xxx->',err);
                    reject(err + '');
                })

        } else {
            //nếu không có gì để ghi thì trả về lỗi
            reject("Không có dữ liệu để ghi!");
        }
    })
}

/**
 * Kẻ khung cho các ô
 * @param {*} cell 
 */
const cellBorder = (cell) => {
    cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
    };
}

/**
 * In đậm và tô màu nền cho các ô
 * @param {*} cell 
 */
const cellFormat = (cell) => {
    cell.font = {
        bold: true
    };
    cell.fill = {
        type: 'pattern',
        pattern: 'darkVertical',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FFFFFFFF' }
    };
}

/**
 * Tạo file Báo cáo kết quả KPIs của đơn vị
 * Biến vào là mảng dữ liệu để ghi báo cáo
 * Tên đơn vị/phòng ban lấy báo cáo
 * Tên chu kỳ báo cáo
 * Tên file excel muốn tạo
 * @param {*} arr 
 * @param {*} organizationName 
 * @param {*} reportName 
 * @param {*} outputFilename 
 */
const createExcelDepartment = (arr, organizationName, reportName, outputFilename) => {
    return new Promise((resolve, reject) => {
        if (arr.length > 0) {
            //xử lý hình cây
            let arrTreeOrder = arrObj.createTreeOrder(arr, 'id', 'parent_id');
            workbook.xlsx.readFile(outputFilename)
                .then(async () => {
                    var worksheet = workbook.getWorksheet('report-excel');
                    var row;
                    //ghi tiêu đề cho bảng
                    row = worksheet.getRow(1);
                    row.getCell(2).value = 'BẢNG ĐÁNH GIÁ Kết quả thực hiện: KPIs CỦA';
                    worksheet.mergeCells('B1:I1');
                    row = worksheet.getRow(2);
                    row.getCell(2).value = organizationName;
                    worksheet.mergeCells('B2:I2');
                    row = worksheet.getRow(3);
                    row.getCell(2).value = 'Kỳ đánh giá: ' + reportName;
                    worksheet.mergeCells('B3:I3');
                    //các biến tính tổng
                    var lastRow, root_weight_percent = 0, total_effective = 0;
                    //ghi dữ liệu vào nội dung của bảng
                    arrTreeOrder.forEach((el, idx) => {
                        row = worksheet.getRow(idx + 6);
                        row.getCell(1).value = el.$tree_index
                        row.getCell(2).value = el.$level === 1 ? el.name.toUpperCase() : el.name
                        row.getCell(3).value = Math.round(el.root_weight_percent * 100) + '%'
                        row.getCell(4).value = el.unit
                        row.getCell(5).value = el.operator_method
                        row.getCell(6).value = el.unit == '%' ? Math.round(el.target * 100) + '%' : el.target
                        row.getCell(7).value = el.unit == '%' ? Math.round(el.target_limit * 100) + '%' : el.target_limit
                        row.getCell(8).value = el.unit == '%' ? Math.round(el.result * 100) + '%' : el.result
                        row.getCell(9).value = Math.round(el.result_effective * 100) + '%'
                        row.getCell(10).value = Math.round(el.total_effective * 100) + '%'
                        //Kẻ khung, in đậm và tô màu nền
                        row.eachCell({ includeEmpty: true }, cell => {
                            if (el.$level === 1) {
                                cellFormat(cell)
                            }
                            cellBorder(cell)
                        });
                        el.$is_leaf === 1 ? root_weight_percent += el.root_weight_percent : '';
                        el.$is_leaf === 1 ? total_effective += el.total_effective : '';
                        lastRow = idx + 6;
                    });
                    //viết tổng kết
                    row = worksheet.getRow(lastRow + 1);
                    row.getCell(2).value = "TỔNG CỘNG";
                    row.getCell(3).value = Math.round(root_weight_percent * 100) + '%';
                    row.getCell(10).value = Math.round(total_effective * 100) + '%';
                    //Kẻ khung, in đậm và tô màu nền
                    row.eachCell({ includeEmpty: true }, cell => {
                        cellFormat(cell)
                        cellBorder(cell)
                    });
                    await workbook.xlsx.writeFile(outputFilename);
                    resolve()
                })
                .catch(err => {
                    //lỗi trong quá trình ghi file excel
                    reject(err + '');
                })
        } else {
            //nếu không có gì để ghi thì trả về lỗi
            reject("Không có dữ liệu để ghi!");
        }
    })
}

/**
 * Tạo file báo cáo kết quả KPIs theo nhân viên
 * Biến vào là mảng dữ liệu để ghi báo cáo
 * Tên đơn vị/phòng ban
 * Tên chu kỳ
 * Tên nhân viên
 * Tên file excel muốn tạo
 * @param {*} arr 
 * @param {*} organizationName 
 * @param {*} reportName 
 * @param {*} staffName 
 * @param {*} outputFilename 
 */
const createExcelStaff = (arr, organizationName, reportName, staffName, outputFilename) => {
    return new Promise((resolve, reject) => {
        if (arr.length > 0) {
            let arrTreeOrder = arrObj.createTreeOrder(arr, 'id', 'parent_id');
            workbook.xlsx.readFile(outputFilename)
                .then(async () => {
                    var worksheet = workbook.getWorksheet('report-excel');
                    var row;
                    //Ghi header cho bảng
                    row = worksheet.getRow(1);
                    row.getCell(2).value = 'BẢNG ĐÁNH GIÁ Kết quả thực hiện: KPIs CỦA';
                    worksheet.mergeCells('B1:I1');
                    //chèn thêm vào một dòng
                    worksheet.spliceRows(2, 0, null);
                    row = worksheet.getRow(2);
                    row.getCell(2).value = staffName;
                    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
                    row.getCell(2).font = {
                        name: 'Times New Roman',
                        size: 14,
                    };
                    worksheet.mergeCells('B2:I2');
                    row = worksheet.getRow(3);
                    row.getCell(2).value = organizationName;
                    worksheet.mergeCells('B3:I3');
                    row = worksheet.getRow(4);
                    row.getCell(2).value = 'Kỳ đánh giá: ' + reportName;
                    worksheet.mergeCells('B4:I4');
                    var lastRow, root_weight_percent = 0, total_effective = 0;
                    //ghi dữ liệu vào nội dung của bảng
                    arrTreeOrder.forEach((el, idx) => {
                        row = worksheet.getRow(idx + 7);
                        row.getCell(1).value = el.$tree_index
                        row.getCell(2).value = el.$level === 1 ? el.name.toUpperCase() : el.name
                        row.getCell(3).value = Math.round(el.root_weight_percent * 100) + '%'
                        row.getCell(4).value = el.unit
                        row.getCell(5).value = el.operator_method
                        row.getCell(6).value = el.unit == '%' ? Math.round(el.target * 100) + '%' : el.target
                        row.getCell(7).value = el.unit == '%' ? Math.round(el.target_limit * 100) + '%' : el.target_limit
                        row.getCell(8).value = el.unit == '%' ? Math.round(el.result * 100) + '%' : el.result
                        row.getCell(9).value = Math.round(el.result_effective * 100) + '%'
                        row.getCell(10).value = Math.round(el.total_effective * 100) + '%'
                        //Kẻ khung, in đậm và tô màu nền
                        row.eachCell({ includeEmpty: true }, cell => {
                            if (el.$level === 1) {
                                cellFormat(cell)
                            }
                            cellBorder(cell)
                        });
                        el.$is_leaf === 1 ? root_weight_percent += el.root_weight_percent : '';
                        el.$is_leaf === 1 ? total_effective += el.total_effective : '';
                        lastRow = idx + 7;
                    });
                    row = worksheet.getRow(lastRow + 1);
                    row.getCell(2).value = "TỔNG CỘNG";
                    row.getCell(3).value = Math.round(root_weight_percent * 100) + '%';
                    row.getCell(10).value = Math.round(total_effective * 100) + '%';
                    //Kẻ khung, in đậm và tô màu nền
                    row.eachCell({ includeEmpty: true }, cell => {
                        cellFormat(cell)
                        cellBorder(cell)
                    });
                    await workbook.xlsx.writeFile(outputFilename);
                    resolve()
                })
                .catch(err => {
                    reject(err + '');
                })

        } else {
            //nếu không có gì để ghi thì trả về lỗi
            reject("Không có dữ liệu để ghi!");
        }
    })
}

/**
 * Xử lý tạo báo cáo excel
 */
class ReportExcelHandler {

    /**
     * Tạo báo cáo bản đồ chiến lược của công ty
     * Biến vào là mã chu kỳ báo cáo
     * Và mã của công ty/Trung tâm
     * Đầu ra là file excel đã được tạo
     * @param {*} req 
     * @param {*} res
     */
    async createReportMap(req, res) {
        //lấy chu kỳ đánh giá
        let report = await db.getRst('select * from reports where id=' + (req.paramS.report_id ? req.paramS.report_id : 0));
        //lấy đơn vị cần tạo báo cáo
        let organization = await db.getRst('select * from organizations where id=' + (req.paramS.organization_id ? req.paramS.organization_id : 0));

        if (report
            && organization
            && report.id
            && organization.id) {
            db.getRsts(`select a.* from report_map_kpi a
                        where status = 1
                        and report_id = ${report.id}
                        and organization_id = ${organization.id}
                        `)
                .then(async results => {
                    // ket qua

                    let outputFilename = dirReport + '/report_map_' + report.id + '_' + organization.id + '.xlsx';
                    fs.createReadStream('./templates/excel-report.xlsx').pipe(fs.createWriteStream(outputFilename));
                    try {
                        await delay(1000) // đợi 3 giây để tạo file xong
                        //xu ly hinh cay va tạo file excel
                        // console.log('results 1', outputFilename);
                        await createExcelMap(results, organization.name, report.name, outputFilename)
                        // console.log('results 2', outputFilename);
                        //đọc file kết quả trả về cho client
                        fs.readFile(outputFilename, { flag: 'r' }, (err, bufferPdf) => {
                            if (err) {
                                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.end(JSON.stringify(err));
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
                                res.end(bufferPdf);
                            }
                        });

                    } catch (err) {
                        //lỗi trong quá trình xuất file excel
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(JSON.stringify({ message: 'Lỗi khi tạo file excel', error: err }));
                    }

                })
                .catch(err => {
                    //lỗi khi thực hiện truy vấn db
                    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ message: 'Không có file pdf nào tồn tại', error: err }));
                });
        } else {
            //lỗi không có biến vào
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'Lỗi không có biến vào', error: 'no param' }));
        }
    }

    /**
     * Tạo báo cáo bộ kpi của đơn vị
     * Biến vào là mã của chu kỳ báo cáo
     * Và mã của đơn vị đó
     * Đầu ra là file excel đã được tạo
     * @param {*} req 
     * @param {*} res
     */
    async createReportDepartment(req, res) {
        //lấy chu kỳ báo cáo
        let report = await db.getRst('select * from reports where id=' + (req.paramS.report_id ? req.paramS.report_id : 1));
        //lấy đơn vị báo cáo
        let organization = await db.getRst('select * from organizations where id=' + (req.paramS.department_id ? req.paramS.department_id : 0));

        if (report
            && organization
            && report.id
            && organization.id
        ) {
            db.getRsts(`select a.* from report_departments_kpi a
                        where status = 1
                        and report_id = ${report.id}
                        and organization_id = ${organization.id}`)
                .then(async results => {
                    let outputFilename = dirReport + '/report_departments_' + report.id + '_' + organization.id + '.xlsx';
                    fs.createReadStream('./templates/excel-report.xlsx').pipe(fs.createWriteStream(outputFilename));
                    try {
                        await delay(1000) // đợi 3 giây để tạo file xong
                        //xu ly hinh cay va tạo file excel
                        await createExcelDepartment(results, organization.name, report.name, outputFilename)
                        fs.readFile(outputFilename, { flag: 'r' }, (err, bufferPdf) => {
                            if (err) {
                                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.end(JSON.stringify(err));
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
                                res.end(bufferPdf);
                            }
                        });
                    } catch (err) {
                        //lỗi trong quá trình xuất file excel
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(JSON.stringify({ message: 'Lỗi khi tạo file excel', error: err }));
                    }
                })
                .catch(err => {
                    //Lỗi trong quá trình truy vấn db
                    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ message: 'Không có file pdf nào tồn tại', error: err }));
                });

        } else {
            //lỗi không có biến vào
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'Lỗi không có biến vào', error: 'no param' }));
        }
    }

    /**
     * Tạo báo cáo bộ KPIs của đơn vị theo tên nhân viên
     * Biến vào là mã của chu kỳ
     * Mã của tổ chức/phòng ban
     * Mã nhân viên
     * Biến ra là file excel đã được tạo
     * @param {*} req 
     * @param {*} res 
     */
    async createReportStaff(req, res) {
        //lấy chu kỳ báo cáo
        let report = await db.getRst('select * from reports where id=' + (req.paramS.report_id ? req.paramS.report_id : 0));

        //lấy nhân viên
        let staff = await db.getRst('select * from staffs where id = ' + (req.paramS.staff_id ? req.paramS.staff_id : 0));

        //tổ chức cấp phòng ban
        let department = await db.getRst('select * from organizations where id=' + (staff && staff.organization_id ? staff.organization_id : 0));

        //tổ chức cấp công ty
        let organization = await db.getRst('select * from organizations where id=' + (department && department.parent_id ? department.parent_id : 0));


        if (report
            && department
            && staff
            && organization
            && report.id
            && department.id
            && organization.id
            && staff.id) {


            db.getRsts(`select a.* from report_staffs_kpi a
                        where status = 1
                        and report_id = ${report.id}
                        and staff_id = ${staff.id}`)
                .then(async results => {
                    let outputFilename = dirReport + '/report_staffs_' + report.id + '_' + department.id + '.xlsx';
                    fs.createReadStream('./templates/excel-report.xlsx').pipe(fs.createWriteStream(outputFilename));
                    try {
                        await delay(1000) // đợi 3 giây để tạo file xong
                        //xu ly hinh cay va tạo file excel
                        await createExcelStaff(results, department.name, report.name, staff.name, outputFilename)
                        //đọc file excel trả về cho client
                        fs.readFile(outputFilename, { flag: 'r' }, (err, bufferPdf) => {
                            if (err) {
                                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.end(JSON.stringify(err));
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
                                res.end(bufferPdf);
                            }
                        });
                    } catch (err) {
                        //lỗi trong quá trình xuất file excel
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(JSON.stringify({ message: 'Lỗi khi tạo file excel', error: err }));
                    }
                })
                .catch(err => {
                    //lỗi khi truy vấn db
                    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ message: 'Không có file pdf nào tồn tại', error: err }));
                });
        } else {
            //lỗi không có biến vào
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'Lỗi không có biến vào', error: 'no param' }));
        }
    }
}

module.exports = new ReportExcelHandler()