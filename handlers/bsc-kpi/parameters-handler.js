
/**
 * Xử lý tham số
 * ver 1.0
 * 16/08/2019
 * 
 */

 //đối tượng xử lý tiếng Việt, cắt họ và tên....
const vnUtils = require('../../utils/vietnamese-handler');

//đối tượng xử lý mảng và đối tượng, cấu trúc cây...
const arrObj = require('../../utils/array-object');

//bộ xử lý cơ sở dữ liệu db...
const db = require('../../db/sqlite3/db-pool');

class Handler {

    /**
     * Hàm này sẽ đẩy dữ liệu json_data từ client API vào csdl
     * 
     * Yêu cầu:
     * 1. quy ước bảng: json_data.table_name = Tên của bảng, 
     * đưa lên và thực hiện xóa trước khi chuyển đổi
     * 
     * 2. quy ước insert,update: json_data.id<0 là chèn mới, json_data.id>0 là update
     * 
     * 3. quy ước trường update của mệnh đề where: wheres=["id","report_id"]
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async postTable(req, res, next) {
        
        let dataJson = req.json_data;
        let tableName = dataJson?dataJson.table_name:undefined;
        let wheres = dataJson?dataJson.wheres:undefined;

        // console.log(dataJson);
        
        if (dataJson && tableName && wheres){

            delete dataJson["table_name"]; //xóa trường giả này đi
            delete dataJson["wheres"]; //xóa trường giả này đi
            
            //yêu cầu bảng phải có thêm 2 trường dữ liệu này
            dataJson.updated_time = Date.now();
            dataJson.signature = JSON.stringify({ username: req.user.username, time: Date.now(), ip: req.clientIp });

            // Chuyển đổi các dữ liệu thành string trước khi lưu vào csdl
            if (dataJson["organization_id"]){
                dataJson["organization_id"] =  parseInt(dataJson["organization_id"]);
            }
    
            if (dataJson["organization_list"]){
                dataJson["organization_list"] = dataJson["organization_list"].map(function(item) {return parseInt(item);});
                //chuyen doi kieu json moi luu duoc
                dataJson["organization_list"] = JSON.stringify(dataJson["organization_list"]);
            }
    
            if (dataJson["staff_id"]){
                dataJson["staff_id"] =  parseInt(dataJson["staff_id"]);
            }
    
            if (dataJson["staff_list"]){
                dataJson["staff_list"] = dataJson["staff_list"].map(function(item) {return parseInt(item);});
                //chuyen doi kieu json moi luu duoc
                dataJson["staff_list"] = JSON.stringify(dataJson["staff_list"]);
            }

            if (dataJson["job_id"]){
                dataJson["job_id"] =  parseInt(dataJson["job_id"]);
            }
    
            if (dataJson["job_list"]){
                dataJson["job_list"] = dataJson["job_list"].map(function(item) {return parseInt(item);});
                //chuyen doi kieu json moi luu duoc
                dataJson["job_list"] = JSON.stringify(dataJson["job_list"]);
            }

            // tên bản là staff, truyền lên là họ và tên, phải tự cắt firstname, lastname để đưa vào sắp xếp
            // console.log('Trước', dataJson, tableName);
            
            if (tableName==='staffs' && dataJson['name']){
                // tự động cắt firstname và lastname
                let splitName = vnUtils.splitFullName(dataJson['name']);
                dataJson.last_name = splitName.last_name;
                dataJson.first_name = splitName.first_name;
            }
    
            // console.log('Sau', JSON.stringify(dataJson));
            try{
                if (dataJson.id<0){
                    delete dataJson["id"]; //xóa trường giả này đi
                    //yêu cầu bảng phải có trường dữ liệu này
                    dataJson.created_time = Date.now();
                    await db.insert(arrObj.convertSqlFromJson(tableName, dataJson, []));
                }else if (dataJson.id>0){
                    await db.update(arrObj.convertSqlFromJson(tableName, dataJson, wheres));
                }
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ status: 'ok', message: 'excuted db', data: dataJson }));
            }catch(e){
                console.log('Loi update parameters', e );
                res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: e, message: "Lỗi parameter-handler update/insert" }));
            }
        }else{
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: err, message: "no structure for cuongdq" }));
        }
        
    }
    
}

module.exports = new Handler()