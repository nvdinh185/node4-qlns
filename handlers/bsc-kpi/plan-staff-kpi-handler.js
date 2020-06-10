"use strict"
/**
 * Bộ xử lý lập kế hoạch kpi cho nhân viên
 * 
 * Nhập kế hoạch,
 * Nhập kết quả đánh giá
 * Tính toán kết quả Tỷ lệ hoàn thành cuối cùng trong bảng báo cáo của BSC-KPI
 * 
 * ver 2.0
 * Date 29/12/2019
 * Fix bug và cho phép cập nhập từ cây KPI
 * 
 * ver 1.0 
 * Created by cuong.dq
 * date: 22/08/2019
 * 
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');


/**
 * Tính Tỷ lệ hoàn thành nhánh cây nhờ lá cây
 * @param {*} reportId 
 * @param {*} staffId 
 * @param {*} parentId 
 */
const updateParentResultEffective = (reportId, staffId, parentId) => {

    db.getRsts(`select 
                a.parent_id
                , sum(a.root_weight_percent) as root_weight_percent
                , sum(a.total_effective) as total_effective
                from report_staffs_kpi a
                where a.status = 1
                and a.staff_id = ${staffId}
                and a.report_id = ${reportId}
                ${(parentId ? ` and a.parent_id = ${parentId}` : ``)}
                group by a.parent_id
                `)
        .then(els => {
            els.forEach(async el => {
                if (el.parent_id && el.total_effective) {
                    let updateResult = {
                        report_id: reportId,
                        id: el.parent_id,
                        operator_method: '', // canh va goc ko co toan tu
                        total_effective: el.total_effective,
                        result_effective: el.total_effective / el.root_weight_percent
                        //chia ngược lại kết quả hoàn thành sẽ ra Tỷ lệ hoàn thành thành phần này
                        // ví dụ tổng Tỷ lệ hoàn thành đạt 80% và thành phần này chiếm tỷ trọng là 80% 
                        // thì kết quả Tỷ lệ hoàn thành đơn lẻ này đạt 100%
                    }
                    await db.update(arrObj.convertSqlFromJson('report_staffs_kpi', updateResult, ['report_id', 'id']));
                }
            })
        });

}


/**
 * Cập nhập Tỷ lệ hoàn thành hoàn thành dựa vào kết quả nhập lên
 * @param {*} reportId 
 * @param {*} id 
 */
const updateResultEffectiveId = (reportId, id) => {

    db.getRst(`select a.* from report_staffs_kpi a
                    where a.report_id=${reportId}
                    and a.id=${id}
                    `)
        .then(async el => {

            // let staffId = el.staff_id; // lay ma nhan vien o day

            //tính Tỷ lệ hoàn thành dựa vào phương pháp tính
            let resultEffective = 0;
            let resultMaxLimit = el.result_max_limit ? el.result_max_limit : 1; //tùy vào chính sách của doanh nghiệp có cho vượt kết hoạch hay không?
            let resultMinLimit = el.result_min_limit ? el.result_min_limit : 0; //tùy vào chính sách của doanh nghiệp có cho phép trừ điểm phạt hay không?
            //nếu đính và giới hạn bằng nhau thì phương pháp tính là >= càng lớn càng tốt, hoặc <= càng nhỏ càng tốt
            if (el.target === el.target_limit) {
                if (el.operation_method === '<=') {
                    //càng nhỏ càng tốt
                    resultEffective = el.result <= el.target ? resultMaxLimit : resultMinLimit;
                } else {
                    //càng lớn càng tốt (hoặc bằng)
                    resultEffective = el.result >= el.target ? resultMaxLimit : resultMinLimit;
                }
            } else {
                //trường hợp đích và giới hạn có thể trừ cho nhau được (thương số !=0)
                //Tính tỷ lệ hoàn thành (phương pháp tính >= và <= đều ra số dương hết)
                let ratio = (el.result - el.target_limit) / (el.target - el.target_limit);

                resultEffective = ratio > resultMaxLimit ? resultMaxLimit : ratio < resultMinLimit ? resultMinLimit : ratio;


            }


            let updateResult = {
                report_id: el.report_id,
                id: el.id,
                result_effective: resultEffective,
                total_effective: resultEffective * el.root_weight_percent
            }
            //cập nhập Tỷ lệ hoàn thành hiện tại của nó
            await db.update(arrObj.convertSqlFromJson('report_staffs_kpi', updateResult, ['report_id', 'id']));

            updateParentResultEffective(reportId, el.staff_id, el.parent_id); //cập nhập luôn Tỷ lệ hoàn thành cấp trên của nó

        })
        .catch(err => {
            console.log('Loi', err);
        })

}



/**
 * Cập nhập trọng số khi có thay đổi trọng số và trạng thái
 * @param {*} reportId 
 * @param {*} staffId 
 */
const updateWeightPercentReportStaff = (reportId, staffId) => {

    if (staffId > 0) {
        //chỉ cập nhập tính toán lại các kpi có trạng thái status=1 mà thôi
        db.getRsts(`select a.* from report_staffs_kpi a
                    where a.status=1
                    and a.report_id=${reportId}
                    and a.staff_id=${staffId}
                    order by order_1`)
            .then(results => {
                let treeOrder = arrObj.createTreeWeight(results, 'id', 'parent_id', 'weight');
                treeOrder.forEach(async (el) => {
                    let jsonForUpdate = {
                        id: el.id,
                        report_id: el.report_id,
                        weight_percent: el.$weight_percent,
                        parent_weight_percent: el.$parent_weight_percent,
                        root_weight_percent: el.$root_weight_percent
                    }
                    await db.update(arrObj.convertSqlFromJson('report_staffs_kpi', jsonForUpdate, ['id']))
                })
            })
            .catch(err => console.log('Loi query', err));
    }
}


/**
 * Khai báo các hàm tương tác với csdl
 * Lấy các tham số đầu vào từ req.json_data, req.paramS, req.form_data, req.user
 * Thực hiện chuyển đổi dữ liệu sang các câu lệnh sql tương thích với csdl
 * Và gọi đối tượng db. để thực thi với csdl
 */
class Handler {

    //----------------------- LẬP KẾ HOẠCH -----------------//
    /**
     * Thực hiện chỉnh sửa một bảng ghi báo cáo này
     * gồm: 
     * thay đổi trọng số
     * Nhập kế hoạch Chỉ tiêu
     * Tạm hoãng KPI này
     * 
     * Dữ liệu truyền lên là bộ json_data update vào csdl
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createPlanStaffKpi(req, res, next) {

        let dataJson = req.json_data;

        dataJson.updated_time = Date.now();
        dataJson.signature = JSON.stringify({ username: req.user.username, time: Date.now() })

        //nếu đơn vị tính là % và giá trị target và giá trị target_limit là có thì phải /cho 100 trước khi update vào csdl
        //khai báo Chỉ tiêu cho kỳ này
        if (dataJson.unit === '%') {
            if (dataJson.target_limit >= 0 && dataJson.target >= 0) {
                dataJson.target_limit = dataJson.target_limit / 100;
                dataJson.target = dataJson.target / 100;
            }

            if (dataJson.result !== undefined && dataJson.result !== null) {
                dataJson.result = dataJson.result / 100;
            }

        }


        if (dataJson.result_min_limit !== undefined && dataJson.result_max_limit !== undefined
            && dataJson.result_min_limit !== null && dataJson.result_max_limit !== null) {
            dataJson.result_min_limit = dataJson.result_min_limit / 100;
            dataJson.result_max_limit = dataJson.result_max_limit / 100;
        }

        //console.log(dataJson);

        if ( // dataJson.staff_id&&
            dataJson.id > 0
            && dataJson.report_id > 0) {
            //cần update
            await db.update(arrObj.convertSqlFromJson("report_staffs_kpi", dataJson, ["report_id", "id"]));
            //trả về bảng ghi có id>0
            if (dataJson.staff_id && (dataJson.status !== undefined || dataJson.weight !== undefined)) {
                //nếu truyền lên có staff_id thì ta tính toán lại toàn bộ trọng số của cây nhân viên này
                updateWeightPercentReportStaff(dataJson.report_id, dataJson.staff_id)
            }

            if (dataJson.result !== undefined && dataJson.result !== null) {
                //tính toán luôn Tỷ lệ hoàn thành đơn lẻ của kết quả so với Chỉ tiêu
                //tính toán cho id (vì truyền lên không đầy đủ)
                updateResultEffectiveId(dataJson.report_id, dataJson.id)
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ data: req.json_data }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
        ));

    }
    /**
     * Lập kế hoạch cho cá nhân
     * 
     * Lấy cây KPIs của cá nhân với trạng thái hoạt động 
     * join với bảng báo cáo kpi
     * 
     * Hiển thị cây với giá trị Chỉ tiêu cho kế hoạch
     * Cho phép người dùng thay đổi Chỉ tiêu trước khi đánh giá
     * 
     * Trạng thái của Chỉ tiêu này sẽ phụ thuộc vào tham số lấy kết quả tự động hay lấy kết quả nhập vào từ người dùng
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createPlanStaff(req, res, next) {

        if (req.paramS.staff_id && req.paramS.report_id) {
            db.getRsts(`WITH RECURSIVE under_tree AS (
                        select a.* from staffs_kpi a
                        where a.bsc_id in (23,24,25)
                        and a.staff_id = ${(req.paramS.staff_id ? req.paramS.staff_id : '0')}
                        UNION ALL
                        SELECT b.*
                            FROM staffs_kpi b JOIN under_tree
                             ON b.parent_id = under_tree.id
                             and b.status = 1
                        ORDER BY order_1)
                        select * from under_tree
                        `)
                .then(async results => {
                    //lấy mảng gốc cây, thực hiện chèn vào csdl
                    for (let idx = 0; idx < results.length; idx++) {
                        let el = results[idx];
                        el.operator_method = el.parent_id > 0 ? el.operator_method : ''; // chi dong bo la cay
                        el.report_id = req.paramS.report_id;
                        el.order_1 = idx + 1;
                        el.created_time = Date.now();
                        el.signature = JSON.stringify({ username: req.user.username, time: Date.now() });
                        try {
                            await db.insert(arrObj.convertSqlFromJson('report_staffs_kpi', el, []))
                        } catch (e) { }
                    };
                    next();
                })
                .catch(err => {
                    res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ message: "Lấy cây kpis của nhân viên bị lỗi", error: err }));
                });
        } else {
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: "Không có tham số phù hợp", error: "No paramS" }));
        }

    }

    /**
     * reset report
     * Tạo lại cây báo cáo 
     * xóa tất cả bảng ghi trong báo cáo
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    deletePlanStaff(req, res, next) {

        if (req.paramS.staff_id && req.paramS.report_id) {
            db.delete(
                arrObj.convertSqlFromJson('report_staffs_kpi'
                    , {
                        report_id: req.paramS.report_id,
                        staff_id: req.paramS.staff_id
                    }
                    , ['report_id', 'staff_id'])
            )
                .then(result => {
                    next();
                })
                .catch(err => {
                    res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ message: "Lấy cây kpis của nhân viên bị lỗi", error: err }));
                });
        } else {
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: "Không có tham số phù hợp", error: "No paramS" }));
        }

    }


    /**
     * Lấy danh sách kpi của cá nhân
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getPlanStaff(req, res) {

        let { report_id, staff_id, staff_ids, department_id } = req.paramS;

        db.getRsts(`select 
                    b.name as staff_name,
                    c.name as organization_name,
                    d.name as job_role_name,
                    e.name as report_name,
                    a.* from report_staffs_kpi a
                    left join staffs b
                    on a.staff_id = b.id
                    left join organizations c
                    on a.organization_id = c.id
                    left join job_roles d
                    on a.job_role_id = d.id
                    left join reports e
                    on a.report_id = e.id
                    where a.status = 1
                    and a.report_id = ${report_id || 0}
                    ${(staff_id ? `and a.staff_id = ${staff_id}` : ``)}
                    ${(staff_ids ? `and a.staff_id in (${staff_ids.toString()})` : ``)}
                    ${(department_id ? `and a.organization_id = ${department_id}` : ``)}
                    order by a.organization_id,  a.staff_id, a.order_1
                    `)
            .then(results => {
                // console.log(results);

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }


}

module.exports = new Handler()