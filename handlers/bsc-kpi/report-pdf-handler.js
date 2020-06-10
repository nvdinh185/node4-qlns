"use strict"
/**
 * Bộ xử lý report pdf
 * Ver 2.0 ngày 18/12/2019 sửa lỗi pdf của cá nhân
 */

const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');

const PDFDocument = require('pdfkit');
const fs = require('fs');

const dirReport = 'user-outputs';
if (!fs.existsSync(dirReport)) fs.mkdirSync(dirReport);

/**
 * Tao file báo cáo thực hiện chiến lược
 * Biến vào là mảng arr
 * Chu kỳ báo cáo, tên tổ chức
 * @param {*} arr 
 * @param {*} reportName 
 * @param {*} organizationName 
 */
const createPdfMap = (arr, organizationName, reportName, outputFilename) => {
    let arrTreeOrder = arrObj.createTreeOrder(arr, 'id', 'parent_id');

    let options = {
        size: 'A4',//tuy chon giay a4
        margin: 0,
    }

    let doc = new PDFDocument(options); //tao tai lieu pdf
    var stream = doc.pipe(fs.createWriteStream(outputFilename));
    //dang ky font chu
    doc.registerFont('Time-new-roman-utf8', './fonts/times.ttf');
    doc.registerFont('OpenSans-Bold', './fonts/OpenSans-Bold.ttf');
    //thiet lap cac khoang cach dong va cot
    const matrix_point = {
        zipper_row: 20, //khoang cach giua 2 dong
        zipper_col: 50, //khoang cach giua 2 cot
    }
    const offset_1 = 40;//khoang cach voi le tren
    const offset_2 = 10;//khoang cach voi le trai
    const maxOnePage = 20;//so tin toi da moi trang

    var lastRow, root_weight_percent = 0, total_effective = 0; //cac bien tinh tong
    for (let i = 0; ; i++) {
        let data = []
        //lấy số tin mỗi trang để ghi vào file
        data = arrTreeOrder.slice(i * maxOnePage, (i + 1) * maxOnePage)
        if (data.length > 0) {
            //Ghi header cua trang
            doc.font('OpenSans-Bold');
            doc.fontSize(16);
            doc.text('BẢNG ĐÁNH GIÁ Kết quả thực hiện: CHIẾN LƯỢC', 0, offset_1, { align: 'center' })
            doc.text(organizationName, 0, matrix_point.zipper_row + offset_1, { align: 'center' })
            doc.text('Kỳ đánh giá: ' + reportName, 0, 2 * matrix_point.zipper_row + offset_1, { align: 'center' })

            //ghi tiêu đề cho bảng
            doc.lineWidth(40)
                .lineCap('butt')
                .strokeColor("blue", 0.3)
                .moveTo(offset_2, matrix_point.zipper_row * 4.8 + offset_1)
                .lineTo(10.5 * matrix_point.zipper_col + 45 + offset_2, matrix_point.zipper_row * 4.8 + offset_1)
                .stroke();
            doc.fontSize(9);
            doc.text('STT', offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 20, align: 'center' })
            doc.text('Tên KPI', 0.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 175, align: 'center' })
            doc.text('Trọng số tích hợp KPI', 4.2 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Đơn vị tính', 5.1 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Phương pháp tính', 6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Chỉ tiêu', 6.9 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Ngưỡng', 7.8 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Kết quả thực hiện', 8.7 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Tỷ lệ hoàn thành', 9.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Điểm quy đổi', 10.5 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })

            let j = 0; //biến đếm để dãn dòng
            data.forEach(el => {
                let lineWidth = 20; //be rong cua background
                if (el.$level === 1) {
                    doc.fontSize(10);
                    doc.font('OpenSans-Bold');
                    doc.lineWidth(lineWidth)
                        .lineCap('butt')
                        .strokeColor("blue", 0.2)
                        .moveTo(offset_2, matrix_point.zipper_row * (6.3 + j) + offset_1)
                        .lineTo(matrix_point.zipper_col * 10.5 + 45 + offset_2, matrix_point.zipper_row * (6.3 + j) + offset_1)
                        .stroke();
                } else if (el.$level === 2) {
                    doc.fontSize(9);
                    doc.font('OpenSans-Bold');
                    doc.lineWidth(lineWidth)
                        .lineCap('butt')
                        .strokeColor("blue", 0.1)
                        .moveTo(0 + offset_2, matrix_point.zipper_row * (6.3 + j) + offset_1)
                        .lineTo(matrix_point.zipper_col * 10.5 + 45 + offset_2, matrix_point.zipper_row * (6.3 + j) + offset_1)
                        .stroke();
                } else {
                    doc.fontSize(9);
                    doc.font('Time-new-roman-utf8');
                }
                doc.text(el.$tree_index, offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'left' })
                doc.text(el.$level === 1 ? el.name.toUpperCase() : el.name, 0.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 175, height: 30, align: 'left' })
                doc.text(Math.round(el.root_weight_percent * 100) + '%', 4.2 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(el.unit, 5.0 * matrix_point.zipper_col, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 55, height: 20, align: 'center' })
                doc.text(el.operator_method, 6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'center' })
                doc.text(el.unit == '%' ? Math.round(el.target * 100) + '%' : el.target, 6.9 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(el.unit == '%' ? Math.round(el.target_limit * 100) + '%' : el.target_limit, 7.8 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(el.unit == '%' ? Math.round(el.result * 100) + '%' : el.result, 8.7 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(Math.round(el.result_effective * 100) + '%', 9.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(Math.round(el.total_effective * 100) + '%', 10.5 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                el.$is_leaf === 1 ? root_weight_percent += el.root_weight_percent : '';
                el.$is_leaf === 1 ? total_effective += el.total_effective : '';
                lastRow = matrix_point.zipper_row * (6.0 + j) + offset_1;
                //điều kiện dãn dòng
                el.$level === 2 ? el.name.length > 36 ? j += 2 : j++ : el.name.length > 46 ? j += 2 : j++;
            });
            doc.font('Time-new-roman-utf8');
            doc.text('Trang ' + (i + 1), matrix_point.zipper_col * 5.8, matrix_point.zipper_row * 40);
            //nếu chưa lấy hết dữ liệu trong mảng cần in thì thêm trang
            //(chỉ số cuối cần lấy nhỏ hơn chiều dài của mảng)
            //console.log('index: ', (i + 1) * maxOnePage)
            //console.log('arrTreeOrder: ', arrTreeOrder.length)
            if ((i + 1) * maxOnePage < arrTreeOrder.length) {
                doc.addPage();
            }
        } else break;
    }
    doc.font('OpenSans-Bold');
    doc.fontSize(10);
    doc.text('TỔNG CỘNG', 0.6 * matrix_point.zipper_col + offset_2, lastRow + 2 * matrix_point.zipper_row)
    doc.text(Math.round(root_weight_percent * 100) + '%', 4.2 * matrix_point.zipper_col + offset_2, lastRow + 2 * matrix_point.zipper_row, { width: 30, height: 20, align: 'right' })
    doc.text(Math.round(total_effective * 100) + '%', 10.5 * matrix_point.zipper_col + offset_2, lastRow + 2 * matrix_point.zipper_row, { width: 30, height: 20, align: 'right' })
    doc.end();

    return stream;
}

/**
 * Tao file báo cáo thực hiện KPIs của phòng
 * Biến vào là mảng arr
 * Chu kỳ báo cáo, tên tổ chức
 * @param {*} arr 
 * @param {*} reportName 
 * @param {*} organizationName 
 */
const createPdfDepartment = (arr, organizationName, reportName, outputFilename) => {
    //xử lý hình cây
    let arrTreeOrder = arrObj.createTreeOrder(arr, 'id', 'parent_id');

    let options = {
        size: 'A4',//tuy chon giay a4
        margin: 0,
    }

    let doc = new PDFDocument(options); //tao tai lieu pdf
    var stream = doc.pipe(fs.createWriteStream(outputFilename));
    //dang ky font chu
    doc.registerFont('Time-new-roman-utf8', './fonts/times.ttf');
    doc.registerFont('OpenSans-Bold', './fonts/OpenSans-Bold.ttf');
    //thiet lap cac khoang cach dong va cot
    const matrix_point = {
        zipper_row: 20, //khoang cach giua 2 dong
        zipper_col: 50, //khoang cach giua 2 cot
    }
    const offset_1 = 40;//khoang cach voi le tren
    const offset_2 = 10;//khoang cach voi le trai
    const maxOnePage = 14;//so tin toi da moi trang

    //dùng vòng lặp lấy từng trang trong mảng để ghi ra file pdf
    let lastRow, root_weight_percent = 0, total_effective = 0; //các biến tính tổng
    for (let i = 0; ; i++) {
        let data = []
        //lấy số tin mỗi trang để ghi vào file
        data = arrTreeOrder.slice(i * maxOnePage, (i + 1) * maxOnePage)
        if (data.length > 0) {
            //Ghi header cua trang
            doc.font('OpenSans-Bold');
            doc.fontSize(16);
            doc.text('BẢNG ĐÁNH GIÁ Kết quả thực hiện: KPIs CỦA', 0, offset_1, { align: 'center' })
            doc.text(organizationName, 0, matrix_point.zipper_row + offset_1, { align: 'center' })
            doc.text('Kỳ đánh giá: ' + reportName, 0, 2 * matrix_point.zipper_row + offset_1, { align: 'center' })

            //ghi tiêu đề cho bảng
            doc.lineWidth(40)
                .lineCap('butt')
                .strokeColor("blue", 0.3)
                .moveTo(offset_2, matrix_point.zipper_row * 4.8 + offset_1)
                .lineTo(10.5 * matrix_point.zipper_col + 45 + offset_2, matrix_point.zipper_row * 4.8 + offset_1)
                .stroke();
            doc.fontSize(9);
            doc.text('STT', offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 20, align: 'center' })
            doc.text('Tên KPI', 0.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 175, align: 'center' })
            doc.text('Trọng số tích hợp KPI', 4.2 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Đơn vị tính', 5.1 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Phương pháp tính', 6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Chỉ tiêu', 6.9 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Ngưỡng', 7.8 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Kết quả thực hiện', 8.7 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Tỷ lệ hoàn thành', 9.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })
            doc.text('Điểm quy đổi', 10.5 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 4 + offset_1, { width: 40, align: 'center' })

            let j = 0; //biến đếm để dãn dòng
            data.forEach(el => {
                let lineWidth = 20 //be rong cua background
                if (el.$level === 1) {
                    doc.fontSize(9);
                    doc.font('OpenSans-Bold');
                    doc.lineWidth(lineWidth)
                        .lineCap('butt')
                        .strokeColor("blue", 0.2)
                        .moveTo(offset_2, matrix_point.zipper_row * (6.3 + j) + offset_1)
                        .lineTo(matrix_point.zipper_col * 10.5 + 45 + offset_2, matrix_point.zipper_row * (6.3 + j) + offset_1)
                        .stroke();
                } else if (el.$level === 2) {
                    doc.fontSize(9);
                    doc.font('Time-new-roman-utf8');
                }
                doc.text(el.$tree_index, offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'left' })
                doc.text(el.name, 0.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 175, height: 30, align: 'left' })
                doc.text(Math.round(el.root_weight_percent * 100) + '%', 4.2 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(el.unit, 5.0 * matrix_point.zipper_col, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 55, height: 20, align: 'center' })
                doc.text(el.operator_method, 6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'center' })
                doc.text(el.unit == '%' ? Math.round(el.target * 100) + '%' : el.target, 6.9 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(el.unit == '%' ? Math.round(el.target_limit * 100) + '%' : el.target_limit, 7.8 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(el.unit == '%' ? Math.round(el.result * 100) + '%' : el.result, 8.7 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(Math.round(el.result_effective * 100) + '%', 9.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(Math.round(el.total_effective * 100) + '%', 10.5 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (6.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                el.$is_leaf === 1 ? root_weight_percent += el.root_weight_percent : '';
                el.$is_leaf === 1 ? total_effective += el.total_effective : '';
                lastRow = matrix_point.zipper_row * (6.0 + j) + offset_1;
                //điều kiện dãn dòng
                el.$level === 1 ? el.name.length > 36 ? j += 2 : j++ : el.name.length > 47 ? j += 2 : j++;
            });

            doc.font('Time-new-roman-utf8');
            doc.text('Trang ' + (i + 1), matrix_point.zipper_col * 5.8, matrix_point.zipper_row * 40);
            //Nếu chỉ số cuối cùng cần lấy nhỏ hơn chiều dài mảng
            //tức là còn dữ liệu trong mảng
            //thì thêm trang mới
            if ((i + 1) * maxOnePage < arrTreeOrder.length) {
                doc.addPage();
            }
        } else break;
    }

    doc.font('OpenSans-Bold');
    doc.fontSize(10);
    doc.text('TỔNG CỘNG', 0.6 * matrix_point.zipper_col + offset_2, lastRow + matrix_point.zipper_row)
    doc.text(Math.round(root_weight_percent * 100) + '%', 4.2 * matrix_point.zipper_col + offset_2, lastRow + matrix_point.zipper_row, { width: 30, height: 20, align: 'right' })
    doc.text(Math.round(total_effective * 100) + '%', 10.5 * matrix_point.zipper_col + offset_2, lastRow + matrix_point.zipper_row, { width: 30, height: 20, align: 'right' })

    doc.end();

    return stream;
}

/**
 * Tao file báo cáo thực hiện KPIs của phòng theo nhân viên
 * Biến vào là mảng arr
 * Chu kỳ báo cáo, tên tổ chức, tên nhân viên
 * @param {*} arr 
 * @param {*} reportName 
 * @param {*} organizationName 
 */
const createPdfStaff = (arr, organizationName, reportName, staffName, outputFilename) => {
    let arrTreeOrder = arrObj.createTreeOrder(arr, 'id', 'parent_id');

    let options = {
        size: 'A4',//tuy chon giay a4
        margin: 0,
    }

    let doc = new PDFDocument(options); //tao tai lieu pdf
    var stream = doc.pipe(fs.createWriteStream(outputFilename));
    //dang ky font chu
    doc.registerFont('Time-new-roman-utf8', './fonts/times.ttf');
    doc.registerFont('OpenSans-Bold', './fonts/OpenSans-Bold.ttf');
    //thiet lap cac khoang cach dong va cot
    const matrix_point = {
        zipper_row: 20, //khoang cach giua 2 dong
        zipper_col: 50, //khoang cach giua 2 cot
    }
    const offset_1 = 40;//khoang cach voi le tren
    const offset_2 = 10;//khoang cach voi le trai
    const maxOnePage = 14;//so tin toi da moi trang
    //dùng vòng lặp lấy từng trang trong mảng để ghi ra file pdf
    let lastRow, root_weight_percent = 0, total_effective = 0; //các biến tính 
    for (let i = 0; ; i++) {
        let data = []
        //lấy số tin mỗi trang để ghi vào file
        data = arrTreeOrder.slice(i * maxOnePage, (i + 1) * maxOnePage)
        if (data.length > 0) {
            //Ghi header cua trang
            doc.font('OpenSans-Bold');
            doc.fontSize(16);
            doc.text('BẢNG ĐÁNH GIÁ Kết quả thực hiện: KPIs CỦA', 0, offset_1, { align: 'center' })
            doc.text(staffName, 0, matrix_point.zipper_row + offset_1, { align: 'center' })
            doc.text(organizationName, 0, 2 * matrix_point.zipper_row + offset_1, { align: 'center' })
            doc.text('Kỳ đánh giá: ' + reportName, 0, 3 * matrix_point.zipper_row + offset_1, { align: 'center' })

            //ghi tiêu đề cho bảng
            doc.lineWidth(40)
                .lineCap('butt')
                .strokeColor("blue", 0.3)
                .moveTo(offset_2, matrix_point.zipper_row * 5.8 + offset_1)
                .lineTo(10.5 * matrix_point.zipper_col + 45 + offset_2, matrix_point.zipper_row * 5.8 + offset_1)
                .stroke();
            doc.fontSize(9);
            doc.text('STT', offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 20, align: 'center' })
            doc.text('Tên KPI', 0.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 175, align: 'center' })
            doc.text('Trọng số tích hợp KPI', 4.2 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 40, align: 'center' })
            doc.text('Đơn vị tính', 5.1 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 40, align: 'center' })
            doc.text('Phương pháp tính', 6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 40, align: 'center' })
            doc.text('Chỉ tiêu', 6.9 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 40, align: 'center' })
            doc.text('Ngưỡng', 7.8 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 40, align: 'center' })
            doc.text('Kết quả thực hiện', 8.7 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 40, align: 'center' })
            doc.text('Tỷ lệ hoàn thành', 9.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 40, align: 'center' })
            doc.text('Điểm quy đổi', 10.5 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * 5 + offset_1, { width: 40, align: 'center' })

            let j = 0; //biến đếm để giãn dòng
            data.forEach(el => {
                let lineWidth = 20 //be rong cua background
                if (el.$level === 1) {
                    doc.fontSize(9);
                    doc.font('OpenSans-Bold');
                    doc.lineWidth(lineWidth)
                        .lineCap('butt')
                        .strokeColor("blue", 0.2)
                        .moveTo(offset_2, matrix_point.zipper_row * (7.3 + j) + offset_1)
                        .lineTo(matrix_point.zipper_col * 10.5 + 45 + offset_2, matrix_point.zipper_row * (7.3 + j) + offset_1)
                        .stroke();
                } else if (el.$level === 2) {
                    doc.fontSize(9);
                    doc.font('Time-new-roman-utf8');
                }
                doc.text(el.$tree_index, offset_2, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 30, height: 20, align: 'left' })
                doc.text(el.name, 0.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 175, height: 30, align: 'left' })
                doc.text(Math.round(el.root_weight_percent * 100) + '%', 4.2 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(el.unit, 5.0 * matrix_point.zipper_col, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 55, height: 20, align: 'center' })
                doc.text(el.operator_method, 6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 30, height: 20, align: 'center' })
                doc.text(el.unit == '%' ? Math.round(el.target * 100) + '%' : el.target, 6.9 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(el.unit == '%' ? Math.round(el.target_limit * 100) + '%' : el.target_limit, 7.8 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(el.unit == '%' ? Math.round(el.result * 100) + '%' : el.result, 8.7 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(Math.round(el.result_effective * 100) + '%', 9.6 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                doc.text(Math.round(el.total_effective * 100) + '%', 10.5 * matrix_point.zipper_col + offset_2, matrix_point.zipper_row * (7.0 + j) + offset_1, { width: 30, height: 20, align: 'right' })
                el.$is_leaf === 1 ? root_weight_percent += el.root_weight_percent : '';
                el.$is_leaf === 1 ? total_effective += el.total_effective : '';
                lastRow = matrix_point.zipper_row * (7.0 + j) + offset_1;
                //điều kiện dãn dòng
                el.$level === 1 ? el.name.length > 36 ? j += 2 : j++ : el.name.length > 46 ? j += 2 : j++;
            });

            doc.font('Time-new-roman-utf8');
            doc.text('Trang ' + (i + 1), matrix_point.zipper_col * 5.8, matrix_point.zipper_row * 40);
            //Nếu chỉ số cuối cùng cần lấy nhỏ hơn chiều dài mảng
            //tức là còn dữ liệu trong mảng
            //thì thêm trang mới
            if ((i + 1) * maxOnePage < arrTreeOrder.length) {
                doc.addPage();
            }
        } else break;
    }

    doc.font('OpenSans-Bold');
    doc.fontSize(10);
    doc.text('TỔNG CỘNG', 0.6 * matrix_point.zipper_col + offset_2, lastRow + matrix_point.zipper_row)
    doc.text(Math.round(root_weight_percent * 100) + '%', 4.2 * matrix_point.zipper_col + offset_2, lastRow + matrix_point.zipper_row, { width: 30, height: 20, align: 'right' })
    doc.text(Math.round(total_effective * 100) + '%', 10.5 * matrix_point.zipper_col + offset_2, lastRow + matrix_point.zipper_row, { width: 30, height: 20, align: 'right' })
    doc.end();

    return stream;
}



/**
 * Xử lý tạo báo cáo pdf
 */
class Handler {

    /**
     * Tạo báo cáo bản đồ chiến lược của công ty
     * Biến vào là chu kỳ báo cáo
     * Và mã của công ty/Trung tâm
     * Đầu ra là file pdf đã được tạo
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createReportMap(req, res, next) {

        let report = await db.getRst(`select * from reports where id=${req.paramS.report_id ? req.paramS.report_id : 1}`);
        let organization = await db.getRst(`select * from organizations where id=${req.paramS.organization_id ? req.paramS.organization_id : 0}`);

        //console.log(report, organization)

        if (report 
            && organization
            && report.id 
            && organization.id) {
            db.getRsts(`select a.* from report_map_kpi a
                        where status = 1
                        and report_id =${report.id}
                        and organization_id = ${organization.id}`)
                .then(results => {
                    //xu ly hinh cay va pdf
                    let outputFilename = dirReport + '/report_map_' + report.id  + '_' + organization.id + '.pdf';

                    let stream = createPdfMap(results, organization.name, report.name, outputFilename)

                    stream.on('finish', () => {
                        fs.readFile(outputFilename, { flag: 'r' }, (err, bufferPdf) => {
                            if (err) {
                                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.end(JSON.stringify(err));
                            }
                            res.writeHead(200, { 'Content-Type': 'application/pdf; charset=utf-8' });
                            res.end(bufferPdf);
                        });
                    });
                })
                .catch(err => {
                    //lỗi thì trả kết quả về lỗi
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ message: 'Không có file pdf nào tồn tại', error: err }));
                });

        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'Lỗi không có biến vào', error: 'no param' }));
        }

    } //end function


    /**
     * Tạo báo cáo bộ kpi của đơn vị
     * Biến vào là chu kỳ báo cáo
     * Và mã của đơn vị đó
     * Đầu ra là file pdf đã được tạo
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createReportDepartment(req, res, next) {

        let report = await db.getRst(`select * from reports where id=${req.paramS.report_id ? req.paramS.report_id : 1}`);
        let organization = await db.getRst(`select * from organizations where id=${req.paramS.department_id ? req.paramS.department_id : 0}`);

        if (report 
            && organization
            && report.id 
            && organization.id
            ) {
            db.getRsts(`select a.* from report_departments_kpi a
                        where status = 1
                        and report_id = ${report.id}
                        and organization_id = ${organization.id}`)
                .then(results => {
                    //xu ly hinh cay va pdf
                    let outputFilename = dirReport + '/report_departments_' + report.id + '_' + organization.id + '.pdf';

                    let stream = createPdfDepartment(results, organization.name, report.name, outputFilename)

                    stream.on('finish', () => {
                        fs.readFile(outputFilename, { flag: 'r' }, (err, bufferPdf) => {
                            if (err) {
                                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.end(JSON.stringify(err));
                            }
                            res.writeHead(200, { 'Content-Type': 'application/pdf; charset=utf-8' });
                            res.end(bufferPdf);
                        });
                    });
                })
                .catch(err => {
                    //lỗi thì trả kết quả về lỗi
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ message: 'Không có file pdf nào tồn tại', error: err }));
                });

        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'Lỗi không có biến vào', error: 'no param' }));
        }
    }

    /**
     * Tạo báo cáo kpi của nhân viên
     * Biến vào là chu kỳ báo cáo
     * Và mã của nhân viên
     * Đầu ra là file pdf đã được tạo
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createReportStaff(req, res, next) {

        let report = await db.getRst(`select * from reports where id in (${req.paramS.report_id})`);
        let staff = await db.getRst(`select * from staffs where id in (${req.paramS.staff_id})`);

        //tổ chức cấp phòng ban
        let department = await db.getRst(`select * from organizations where id in (${staff && staff.organization_id ? staff.organization_id:0})`);

        //tổ chức cấp công ty
        let organization = await db.getRst(`select * from organizations where id in (${department && department.parent_id? department.parent_id:0})`);

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
                .then(results => {
                    //xu ly hinh cay va pdf
                    let outputFilename = dirReport + '/report_staffs_' + report.id + '_' + staff.id + '.pdf';

                    let stream = createPdfStaff(results, department.name + ' - ' + organization.name, report.name, staff.name, outputFilename)

                    stream.on('finish', () => {
                        fs.readFile(outputFilename, { flag: 'r' }, (err, bufferPdf) => {
                            if (err) {
                                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.end(JSON.stringify(err));
                            }
                            res.writeHead(200, { 'Content-Type': 'application/pdf; charset=utf-8' });
                            res.end(bufferPdf);
                        });
                    });
                })
                .catch(err => {
                    //lỗi thì trả kết quả về lỗi
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ message: 'Không có file pdf nào tồn tại', error: err }));
                });

        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'Lỗi không có biến vào', error: 'no param' }));
        }
    }

}

module.exports = new Handler()