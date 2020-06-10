"use strict"
/**
 * Bộ xử lý phân rã kpi cho các vai trò của bộ phận
 * 
 * ver 1.0 
 * Created by cuong.dq
 * date: 24/08/2019
 * 
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');



/**
 * Khai báo các hàm tương tác với csdl
 * Lấy các tham số đầu vào từ req.json_data, req.paramS, req.form_data, req.user
 * Thực hiện chuyển đổi dữ liệu sang các câu lệnh sql tương thích với csdl
 * Và gọi đối tượng db. để thực thi với csdl
 */
class Handler {

    //----------------------- PHÂN RÃ KPI -----------------//
    /**
     * Phân rã bản đồ chiến lược xuống các bộ phận
     * 
     * Dữ liệu truyền lên là bộ json_data update vào csdl
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createSeperatedRoleKpi(req,res,next){
        
        let dataJson = req.json_data;
        
        dataJson.updated_time = Date.now();
        dataJson.signature = JSON.stringify({ username: req.user.username, time: Date.now() })

        //nếu đơn vị tính là % và giá trị target và giá trị target_limit là có thì phải /cho 100 trước khi update vào csdl
        //khai báo Chỉ tiêu cho kỳ này
        if (dataJson.unit==='%'){
            if (dataJson.target_limit>=0 && dataJson.target>=0){
                dataJson.target_limit = dataJson.target_limit/100;
                dataJson.target = dataJson.target/100;
            }
        }

        if (dataJson.result_min_limit !==undefined && dataJson.result_max_limit !==undefined
            && dataJson.result_min_limit !==null && dataJson.result_max_limit !==null ) {
            dataJson.result_min_limit = dataJson.result_min_limit / 100;
            dataJson.result_max_limit = dataJson.result_max_limit / 100;
        }

        // Trọng số phân rã được chi cho 100 cho đúng bản chất kéo, nhập %
        if (dataJson.weight !==undefined && dataJson.weight !==null) {
            dataJson.weight = dataJson.weight / 100;
        }
        
        if (dataJson.id<0) { 
            //cần tạo mới
            //Trước tiên phải xóa id để hệ thống tự tạo id mới
            delete dataJson["id"]; //xóa đi để tạo mới
            dataJson.created_time = Date.now();
            await db.insert(arrObj.convertSqlFromJson("seperated_roles_kpi", dataJson, []));
            //console.log(rt);
            //select lấy kết quả vừa chèn bởi chuổi dataJson
            //Thực chất parent_id là lấy id của gốc rồi tính toán lại các con

        }else if (dataJson.id>0) { 
            //cần update
            await db.update(arrObj.convertSqlFromJson("seperated_roles_kpi", dataJson, ["id"]));
            //trả về bảng ghi có id>0
            //console.log(rt);

        }
        
        
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({data: req.json_data}
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
        ));

    }
    


}

module.exports = new Handler()