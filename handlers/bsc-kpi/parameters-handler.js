//đối tượng xử lý tiếng Việt, cắt họ và tên....
const vnUtils = require('../../utils/vietnamese-handler');

//đối tượng xử lý mảng và đối tượng, cấu trúc cây...
const arrObj = require('../../utils/array-object');

//bộ xử lý cơ sở dữ liệu db...
const db = require('../../db/sqlite3/db-pool');

class Handler {

    /**
     * Hàm này sẽ đẩy dữ liệu json_data từ client vào csdl
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async postTable(req, res, next) {

        let dataJson = req.json_data;
        let tableName = dataJson ? dataJson.table_name : undefined;
        let wheres = dataJson ? dataJson.wheres : undefined;

        // console.log(dataJson);

        if (dataJson && tableName && wheres) {

            delete dataJson["table_name"]; //xóa trường giả này đi
            delete dataJson["wheres"]; //xóa trường giả này đi

            dataJson.updated_time = Date.now();

            if (dataJson["job_list"]) {
                dataJson["job_list"] = dataJson["job_list"].map(function (item) { return parseInt(item); });
                dataJson["job_list"] = JSON.stringify(dataJson["job_list"]);
            }

            // tên bảng là staffs, truyền lên là họ và tên, phải tự cắt firstname, lastname để đưa vào sắp xếp

            if (tableName === 'staffs' && dataJson['name']) {
                // tự động cắt firstname và lastname
                let splitName = vnUtils.splitFullName(dataJson['name']);
                dataJson.last_name = splitName.last_name;
                dataJson.first_name = splitName.first_name;
            }

            try {
                if (dataJson.id < 0) {
                    delete dataJson["id"]; //xóa trường giả này đi
                    dataJson.created_time = Date.now();
                    await db.insert(arrObj.convertSqlFromJson(tableName, dataJson));
                } else if (dataJson.id > 0) {
                    await db.update(arrObj.convertSqlFromJson(tableName, dataJson, wheres));
                }
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ status: 'ok', message: 'excuted db', data: dataJson }));
            } catch (e) {
                console.log('Loi update parameters', e);
                res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: e, message: "Lỗi parameter-handler update/insert" }));
            }
        } else {
            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: "Lỗi", message: "no structure for cuongdq" }));
        }

    }

}

module.exports = new Handler()