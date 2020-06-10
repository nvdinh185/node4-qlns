"use strict"
/**
 * Bộ xử lý upload json cho từng nghiệp vụ
 * 
 */
const arrObj = require('../../../utils/array-object');
const db = require('../../../db/sqlite3/db-pool');
// hàm tính toán trọng số quy đổi cho bộ phận
const depFunc = require('../department-kpi-functions');
// các hàm tính toán trọng số quy đổi cho nhân viên
const staffFunc = require('../staff-kpi-functions');

// hàm tạo cây cho bộ phận và cho cá nhân
const createFunc = require('./upload-functions');


class Handler {

    // biến vào là req.user, req.json_data
    // thực hiện khóa hết tất cả các kpi hiện có của công ty
    // kiểm tra quyền user có quyền không đã nhé
    async uploadStrategyMap(req, res) {
        // console.log('lấy được', req.json_data);
        let message;

        try {
            let organizationId = (req.json_data.organization_id || req.paramS.organization_id || 0)
            let data = req.json_data.data;
            let { period_id, period_name } = req.json_data;

            // console.log('Chu kỳ này', period_id, period_name);

            if (organizationId && data) {

                if (!period_id) {
                    // thực hiện tạo giai đoạn đánh giá mới
                    period_name = period_name || `Năm ${(new Date()).getFullYear()}`;

                    await db.insert(db.convertSqlFromJson('strategy_period'
                        , {
                            organization_id: organizationId,
                            name: period_name
                        }))
                    let { maxPeriodId } = await db.getRst(`select max(id) as maxPeriodId from strategy_period where name='${period_name}' and organization_id=${organizationId}`)
                    period_id = maxPeriodId;

                    // thực hiện xóa chu kỳ cũ và chèn chu kỳ mới vào
                    await db.runSql(`with
                                    map as 
                                    (select * from strategy_map
                                    where status=1
                                    and organization_id = ${organizationId})
                                    , seperated as 
                                    (select a.* from seperated_map_kpi a,  map b
                                    where a.map_id = b.id)
                                    , department as
                                    (select a.* from departments_kpi a, seperated b
                                    where a.seperated_map_id = b.id)
                                    , role as  
                                    (select a.* from seperated_roles_kpi a, department b
                                    where a.department_kpi_id = b.id)
                                    , staff as 
                                    (select a.* from staffs_kpi a, role b
                                    where a.seperated_role_id = b.id)
                                    update staffs_kpi set status=0 where id in (select id from staff)`);

                    await db.runSql(`with
                                    map as 
                                    (select * from strategy_map
                                    where status=1
                                    and organization_id = ${organizationId})
                                    , seperated as 
                                    (select a.* from seperated_map_kpi a,  map b
                                    where a.map_id = b.id)
                                    , department as
                                    (select a.* from departments_kpi a, seperated b
                                    where a.seperated_map_id = b.id)
                                    , role as  
                                    (select a.* from seperated_roles_kpi a, department b
                                    where a.department_kpi_id = b.id)
                                    update seperated_roles_kpi set status=0 where id in (select id from role)`);

                    await db.runSql(`with
                                    map as 
                                    (select * from strategy_map
                                    where status=1
                                    and organization_id = ${organizationId})
                                    , seperated as 
                                    (select a.* from seperated_map_kpi a,  map b
                                    where a.map_id = b.id)
                                    , department as
                                    (select a.* from departments_kpi a, seperated b
                                    where a.seperated_map_id = b.id)
                                    update departments_kpi set status=0 where id in (select id from department)`);

                    await db.runSql(`with
                                    map as 
                                    (select * from strategy_map
                                    where status=1
                                    and organization_id = ${organizationId})
                                    , seperated as 
                                    (select a.* from seperated_map_kpi a,  map b
                                    where a.map_id = b.id)
                                    update seperated_map_kpi set status=0 where id in (select id from seperated)`);

                    await db.runSql(`update strategy_map
                                    set status = 0
                                    where status=1
                                    and organization_id = ${organizationId}`);

                    let { maxId } = await db.getRst(`select max(id) as maxId from strategy_map`)

                    // chèn mới vào nhé
                    for (let idx = 0; idx < data.length; idx++) {
                        let el = data[idx];
                        let jsonInsert = {
                            id: el.id < 0 ? -el.id + maxId : el.id
                            , parent_id: el.parent_id < 0 ? -el.parent_id + maxId : el.parent_id
                            , organization_id: organizationId
                            , bsc_id: el.bsc_id
                            , period_id: period_id
                            , name: el.name
                            , weight: el.weight
                            , weight_percent: el.weight_percent
                            , parent_weight_percent: el.parent_weight_percent
                            , root_weight_percent: el.root_weight_percent
                            , unit: el.unit
                            , calculating_description: el.calculating_description
                            , target: el.target
                            , target_limit: el.target_limit
                            , frequency_review: el.frequency_review
                            , frequency_record: el.frequency_record
                            , operator_method: el.operator_method
                            , order_1: idx + 1
                            , depth: el.depth
                            , is_leaf: el.is_leaf
                            , status: 1
                        }
                        // chỉ cho tạo mới các el.id<0 thôi
                        if (el.id < 0)
                            await db.insert(db.convertSqlFromJson('strategy_map', jsonInsert))
                    }

                    message = `Tạo mới giai đoạn ${period_id}-${period_name} thành công!`
                } else {
                    // thực hiện cập nhập bản đồ chiến lược của giai đoạn hiện tại
                    // chỉ có thể thêm mới kpi, thêm mới mục tiêu mà không cho phép thêm mới các viễn cảnh???
                    // chỉ được phép update lại viễn cảnh mà thôi
                    // chèn mới vào nhé
                    let { maxId } = await db.getRst(`select max(id) as maxId from strategy_map`)

                    for (let idx = 0; idx < data.length; idx++) {
                        let el = data[idx];
                        let jsonInsert = {
                            id: el.id < 0 ? -el.id + maxId : el.id
                            // trường hợp update theo mã id có sẵn thì chỉ update đúng và không update cấu trúc cây
                            , parent_id: el.id > 0 ? undefined : el.parent_id < 0 ? -el.parent_id + maxId : el.parent_id
                            // chu kỳ thì update như cũ
                            , period_id: period_id
                            // các tham số khác thì update như excel
                            , organization_id: organizationId
                            , bsc_id: el.bsc_id
                            , name: el.name
                            , weight: el.weight
                            , weight_percent: el.weight_percent
                            , parent_weight_percent: el.parent_weight_percent
                            , root_weight_percent: el.root_weight_percent
                            , unit: el.unit
                            , calculating_description: el.calculating_description
                            , target: el.target
                            , target_limit: el.target_limit
                            , frequency_review: el.frequency_review
                            , frequency_record: el.frequency_record
                            , operator_method: el.operator_method
                            , order_1: idx + 1
                            , depth: el.depth
                            , is_leaf: el.is_leaf
                            // , status: 1    // chu kỳ update thì không update trạng thái
                        }
                        if (el.id < 0 && jsonInsert.parent_id > 0) {
                            // chèn mới kpi, mục tiêu? hoặc viễn cảnh
                            // console.log('chèn mới', el.id, el.parent_id, jsonInsert.id, jsonInsert.parent_id);
                            // Không cho chèn viễn cảnh mới vào nhé
                            // chỉ chèn vào mã parent_id có trạng thái là hoạt động
                            let { status } = await db.getRst(`select status from strategy_map where id=${jsonInsert.parent_id} and period_id=${jsonInsert.period_id}`)
                            if (status === 1) await db.insert(db.convertSqlFromJson('strategy_map', jsonInsert))
                        } else {
                            // chỉ cập nhập các id có mã gán đúng chu kỳ, hoặc có tên đúng chu kỳ
                            if (el.id > 0 && jsonInsert.parent_id === undefined) {
                                // chỉ cập nhập đúng giai đoạn và mã id đúng với giai đoạn đó
                                await db.update(db.convertSqlFromJson('strategy_map', jsonInsert, ["id", "period_id"]))
                                // hoặc update đúng tên kpi (name) và đúng giai đoạn đó (dùng index, name để tìm)
                                await db.update(db.convertSqlFromJson('strategy_map', jsonInsert, ["name", "period_id"]))
                            }
                        }
                    }
                    message = `Cập nhập giai đoạn ${period_id}-${period_name} thành công!`
                }
            }
        } catch (err) {
            console.log('Lỗi uploadStrategyMap', err);
        }


        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: "OK", message }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
            , 2
        ));

    }

    // upload phân rã cho đơn vị
    async uploadSeperatedMap(req, res) {

        let message;

        try {
            let organizationId = (req.json_data.organization_id || req.paramS.organization_id || 0)
            let results = req.json_data.data;

            // console.log('lấy được', organizationId);

            if (organizationId && results && Array.isArray(results)) {
                // chuyển đổi cây trước khi chèn vào để đảm bảo có mã parent
                let resultsUK = arrObj.convertArrayToObjects(results, "map_id")

                // lấy mã id cực đại cho trước
                let { maxId } = await db.getRst(`select max(id) as maxId from seperated_map_kpi`)

                let newIndex = maxId || 0; // khởi tạo index mới nếu có
                // lấy được danh sách map_id đã phân rã trong cây truyền lên
                let mapIds = Object.keys(resultsUK);

                // truy vấn dữ liệu lấy cây dã phân rã trước cho map truyền lên này
                // -- mã kpi gốc đã phân rã
                let seperatedMaps = await db.getRsts(
                    `select *
                     from seperated_map_kpi
                        where map_id in (${mapIds.toString()})
                     `)

                // console.log('seperated', seperatedMaps);

                let seperatedMapsUK = arrObj.convertArrayToObjects(seperatedMaps, "map_id")

                // bây giờ ta duyệt mã
                for (let key in resultsUK) {

                    let departments = resultsUK[key] || [];
                    // lấy gốc cây trước (nếu tìm thấy được)
                    // console.log('tim bo phan',departments);

                    // mệnh đề này sẽ ưu tiên lấy C đã có mã id>0 được truyền lên
                    let getC = departments.find(x => x.kpi_role === "C" && x.id > 0 && !x.parent_id)
                        || departments.find(x => x.kpi_role === "C" && x.id > 0)
                        || departments.find(x => x.kpi_role === "C");


                    // nếu tìm thấy vai trò chủ trì mới tổ chức cây phân rã
                    // và đã gán cho đơn vị chủ trì nào đó
                    if (getC && getC.organization_id) {
                        // gốc cây thật sự -- tìm ra các bộ phận đã phân rã chưa
                        // đã phân rã cho bộ phận này chưa
                        // tìm kiếm id tồn tại đã lưu trong csdl của bộ phận tương ứng
                        // ưu tiên có vai trò C, là gốc cây trước đó --> vai trò C không phải gốc cây --> vai trò khác nếu có
                        let savedDepartments = seperatedMapsUK[key] || [];

                        // console.log('tim bo phan',savedDepartments);

                        let getCSave =
                            savedDepartments.find(x => x.organization_id === getC.organization_id && x.kpi_role === "C" && !x.parent_id)
                            || savedDepartments.find(x => x.organization_id === getC.organization_id && x.kpi_role === "C")
                            || savedDepartments.find(x => x.organization_id === getC.organization_id);


                        let isUpdateC = getC.id > 0 ? true : getCSave ? true : false;
                        getC.id = getC.id > 0 ? getC.id : getCSave ? getCSave.id : ++newIndex;
                        getC.parent_id = undefined; // reset 

                        let dataJson = {
                            id: getC.id
                            , organization_id: getC.organization_id
                            , map_id: getC.map_id
                            , kpi_role: getC.kpi_role
                            , name: getC.name
                            , weight: getC.weight
                            , parent_weight_percent: getC.weight
                            , unit: getC.unit
                            , calculating_description: getC.calculating_description
                            , status: 1
                        }

                        if (isUpdateC) {
                            dataJson.updated_time = Date.now();
                            let rt = await db.update(arrObj.convertSqlFromJson("seperated_map_kpi", dataJson, ["id"]));
                            // console.log('Update C', rt);
                        } else {
                            dataJson.created_time = Date.now();
                            let rt = await db.insert(arrObj.convertSqlFromJson("seperated_map_kpi", dataJson, []));
                            // console.log('insert id C', rt);
                        }

                        // phân rã tiếp các lá cây tiếp theo lấy gốc cây đã làm ở trên

                        for (let idx = 0; idx < departments.length; idx++) {
                            let el = departments[idx];
                            // chỉ vai trò trực tiếp
                            // hoặc chủ trì mà không phải phòng gốc (mà mã id khác với g gốc) đều là phân rã con hết
                            if (el.kpi_role !== "C"
                                || (el.kpi_role === "C"
                                    && (el.organization_id !== getC.organization_id
                                        // hoặc phòng gốc nhưng mã id khác (tức thêm một C con nữa)
                                        || (el.organization_id === getC.organization_id && el.id != getC.id))
                                )) {

                                // trường hợp có id truyền lên thì thực hiện update
                                let isUpdateTr = el.id > 0;
                                // trường hợp không có id truyền lên thì
                                // nếu tìm thấy mã đơn lẻ trong csdl thì lấy mã đó update

                                // nếu nhiều mã trong csdl thì ko cho phép
                                // nếu có mã parent_id truyền lên mà trùng với mã gốc 
                                // thì tạo mới tự động để chèn vào
                                // nếu không tìm thấy đơn lẻ trong csdl thì chèn mới vào
                                if (!isUpdateTr) {
                                    // tìm mã trực tiếp đã lưu vào csdl chưa
                                    // tránh bảng ghi trực tiếp vừa cập nhập ở trên
                                    let getTrSaves = await db.getRsts(
                                        `select id, parent_id, map_id, kpi_role, name 
                                        from seperated_map_kpi
                                            where map_id = ${el.map_id}                 -- mã kpi gốc   
                                            and organization_id = ${el.organization_id} -- phòng này có chưa?
                                            and id <> ${getC.id}
                                        `)

                                    // console.log('Số bản ghi', getTrSaves);

                                    if (getTrSaves && getTrSaves.length > 0) {
                                        // ưu tiên nếu lưu trùng tên trước đó thì update
                                        let oldName = getTrSaves.find(x => x.name === el.name);
                                        if (oldName) {
                                            el.id = oldName.id;
                                            isUpdateTr = true;
                                        } else if (el.parent_id === getC.id) {
                                            // nếu có mã cấp cha trùng với cấy gốc thì cho chèn vào
                                            el.id = ++newIndex
                                        } else if (getTrSaves.length === 1) {
                                            // trường hợp chỉ có 1 bảng ghi trước đó thì update
                                            el.id = getTrSaves[0].id;
                                            isUpdateTr = true;
                                        } else {
                                            // trường hợp ko trùng tên, và nhiều hơn 1 bảng ghi tồn tại
                                            // nhưng parent_id trùng với gốc (tức có phân rã ở client theo parent)
                                            // thì cho phép tạo mới // tức có el.id >0 đó
                                            el.id = ++newIndex
                                        }
                                    } else {
                                        // chưa tồn tại bảng ghi nào của bộ phận như này trong csdl
                                        // thì cho phép chèn mới
                                        el.id = ++newIndex
                                    }
                                }

                                // mã đưa vào csdl phải >0
                                if (el.id > 0) {
                                    // mã lấy ở trên
                                    let dataJsonTr = {
                                        id: el.id
                                        , parent_id: getC.id
                                        , organization_id: el.organization_id
                                        , map_id: el.map_id
                                        , kpi_role: el.kpi_role
                                        , name: el.name
                                        , weight: el.weight
                                        , parent_weight_percent: el.weight
                                        , unit: el.unit
                                        , calculating_description: el.calculating_description
                                        , status: 1
                                    }

                                    if (isUpdateTr) {
                                        dataJsonTr.updated_time = Date.now();
                                        let rt = await db.update(arrObj.convertSqlFromJson("seperated_map_kpi", dataJsonTr, ["id"]));
                                        // console.log('Update Tr', rt);
                                    } else {
                                        dataJsonTr.created_time = Date.now();
                                        let rt = await db.insert(arrObj.convertSqlFromJson("seperated_map_kpi", dataJsonTr, []));
                                        // console.log('insert id Tr', rt);
                                    }

                                }

                            }
                        }
                    }
                }
            }

            message = "Cập nhập thành công cây phân rã upload"

        } catch (err) {
            console.log('Lỗi uploadSeperatedMap', err);
            message = "Lỗi không xử lý được dữ liệu"
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: "OK", message }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
            , 2
        ));
    }

    // upload Kpi gán cho đơn vị
    async uploadDepartmentsKpi(req, res, next) {
        // console.log('lấy được', req.json_data);
        let message;
        let { organization_id, period_id, data } = req.json_data;
        // lấy được danh sách data chứa ds department_id
        if (organization_id && period_id && data && Array.isArray(data)) {
            try {
                let departmentIds = arrObj.convertArrayToObjects(data, 'department_id')

                // console.log("bo phan OK", Object.keys(departmentIds));

                for (let key in departmentIds) {
                    // duyệt tất cả phòng có kpi truyền lên key chính là mã đơn vị
                    // console.log("department :", key);
                    let oneDepartmentKpis = departmentIds[key];
                    let seperatedKpis = oneDepartmentKpis.filter(x => x.seperated_id > 0 && (x.kpi_role === "C" || x.kpi_role === "Tr"))
                    // console.log("seperatedKpisUK", seperatedKpis.length);
                    let seperatedKpisUK = arrObj.convertArrayToObject(seperatedKpis, "seperated_id")
                    // console.log("seperatedKpisUK", Object.keys(seperatedKpisUK)); 
                    // console.log("seperatedKpisUK after", Object.keys(seperatedKpisUK).length);

                    let privateKpis = oneDepartmentKpis.filter(x => !x.seperated_id && (x.kpi_role === "R" || x.kpi_role === "Ts" || x.kpi_role === "Tz"))


                    // kiểm tra gốc cây của phòng đã tạo chưa? nếu chưa thì tạo trước để gán và update toàn bộ kpi về 0
                    let ok = await createFunc.createRootDepartment(organization_id, key);

                    // console.log("createRootDepartment?", ok);

                    // lấy kpi từ csdl ra (trường có tên là seperated_map_id)
                    let curDepartmentKpi = await createFunc.getDepartmentKpiTree(key);

                    // console.log("curDepartmentKpi?", curDepartmentKpi.length);

                    let curDepartmentKpiTree = arrObj.createTree(curDepartmentKpi, "id", "parent_id") || [];

                    // console.log("curDepartmentKpiTree", curDepartmentKpiTree.length);

                    for (let iroot = 0; iroot < curDepartmentKpiTree.length; iroot++) {
                        let rootEl = curDepartmentKpiTree[iroot];
                        let children = rootEl.$children;
                        // console.log("length?", rootEl);
                        if (children && Array.isArray(children)) {
                            if (rootEl.bsc_id === 21) {
                                // cây phân rã
                                for (let i = 0; i < children.length; i++) {
                                    let kpi = children[i];
                                    let updatedUK = seperatedKpisUK[kpi.seperated_map_id];
                                    if (updatedUK) {
                                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                                        // chỉ update tên, ... chỉ tiêu khác thôi
                                        let jsonUpdate = {
                                            id: kpi.id
                                            , name: updatedUK.department_kpi_name || kpi.name
                                            , kpi_role: updatedUK.kpi_role
                                            , seperated_weight: updatedUK.seperated_weight || kpi.seperated_weight
                                            , calculating_description: updatedUK.calculating_description || kpi.calculating_description
                                            , unit: updatedUK.unit || kpi.unit
                                            , target: updatedUK.target || kpi.target
                                            , status: 1 // kích hoạt lại trạng thái hoạt động
                                        }
                                        await db.update(db.convertSqlFromJson("departments_kpi", jsonUpdate, ["id"]))
                                        // xóa key đã trùng này trong seperatedKpisUK để không chèn mới nữa
                                        delete seperatedKpisUK[kpi.seperated_map_id]
                                    } else if (kpi.status) { // trạng thái hoạt động thì update về 0
                                        // không truyền lên (thì update trạng thái về 0 nhé)
                                        await db.update(db.convertSqlFromJson("departments_kpi", { id: kpi.id, status: 0 }, ["id"]))
                                    }
                                }
                                // còn lại các phân rã mới chưa có trong csdl
                                for (let sepKey in seperatedKpisUK) {
                                    let el = seperatedKpisUK[sepKey]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: el.department_id
                                        , seperated_map_id: el.seperated_id
                                        , map_id: el.map_id
                                        , name: el.department_kpi_name
                                        , kpi_role: el.kpi_role
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: el.seperated_weight * (el.self_weight || 0.5) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("departments_kpi", jsonInsert))
                                }

                                // console.log("end seperatedKpisUK");
                            }

                            if (rootEl.bsc_id === 22) {
                                // cây riêng
                                for (let i = 0; i < children.length; i++) {
                                    let kpi = children[i];

                                    // console.log(kpi, privateKpis );

                                    let indexPrivate = privateKpis.findIndex(x => x.department_kpi_name === kpi.name || x.department_kpi_id === kpi.id)

                                    // console.log("INDEX TÌM", indexPrivate );

                                    if (indexPrivate >= 0) {
                                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                                        // chỉ update tên, ... chỉ tiêu khác thôi
                                        let updatedUK = privateKpis[indexPrivate];
                                        // thực hiện update như trên

                                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                                        // chỉ update tên, ... chỉ tiêu khác thôi
                                        let jsonUpdate = {
                                            id: kpi.id
                                            , name: updatedUK.department_kpi_name || kpi.name
                                            , kpi_role: updatedUK.kpi_role
                                            , seperated_weight: updatedUK.seperated_weight
                                            , self_weight: updatedUK.self_weight || 0.5
                                            , weight: updatedUK.seperated_weight * (updatedUK.self_weight || 0.5) || 1
                                            , calculating_description: updatedUK.calculating_description || kpi.calculating_description
                                            , unit: updatedUK.unit || kpi.unit
                                            , target: updatedUK.target || kpi.target
                                            , status: 1 // kích hoạt lại trạng thái hoạt động
                                        }
                                        await db.update(db.convertSqlFromJson("departments_kpi", jsonUpdate, ["id"]))
                                        // xóa key đã trùng này trong seperatedKpisUK để không chèn mới nữa
                                        delete seperatedKpisUK[kpi.seperated_map_id]

                                        // xóa key đã trùng này trong seperatedKpisUK để không chèn mới nữa
                                        privateKpis.splice(indexPrivate, 1)
                                    } else if (kpi.status) { // trạng thái hoạt động thì update về 0
                                        // không truyền lên (thì update trạng thái về 0 nhé)
                                        // không truyền lên (thì update trạng thái về 0 nhé)
                                        await db.update(db.convertSqlFromJson("departments_kpi", { id: kpi.id, status: 0 }, ["id"]))
                                    }
                                }
                                // console.log("end 22");
                                // còn lại mãng mới cần insert lên cây
                                // còn lại các phân rã mới chưa có trong csdl
                                for (let idx = 0; idx < privateKpis.length; idx++) {
                                    let el = privateKpis[idx]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: el.department_id
                                        , name: el.department_kpi_name
                                        , kpi_role: el.kpi_role
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: el.seperated_weight * (el.self_weight || 0.5) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("departments_kpi", jsonInsert))
                                    // console.log("Chèn Đã có cây 22", jsonInsert);
                                }
                                // console.log("end privateKpis");
                            }
                        } else {
                            // don vi do chua co gi thi chen moi hoan toan, ke ca truyen len id
                            if (rootEl.bsc_id === 21) {
                                // cây phân rã
                                for (let sepKey in seperatedKpisUK) {
                                    let el = seperatedKpisUK[sepKey]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: el.department_id
                                        , seperated_map_id: el.seperated_id
                                        , map_id: el.map_id
                                        , name: el.department_kpi_name
                                        , kpi_role: el.kpi_role
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: el.seperated_weight * (el.self_weight || 0.5) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("departments_kpi", jsonInsert))
                                }
                                // console.log("end seperatedKpisUK");
                            }

                            if (rootEl.bsc_id === 22) {
                                // cây riêng
                                // còn lại các phân rã mới chưa có trong csdl
                                for (let idx = 0; idx < privateKpis.length; idx++) {
                                    let el = privateKpis[idx]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: el.department_id
                                        // , seperated_map_id: el.seperated_id
                                        , map_id: el.map_id
                                        , name: el.department_kpi_name
                                        , kpi_role: el.kpi_role
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: el.seperated_weight * (el.self_weight || 0.5) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("departments_kpi", jsonInsert))
                                    // console.log("Chèn chưa có cây 22", jsonInsert);
                                }
                            }
                        }
                    }
                    // đã tổ chức xong kpi cho 1 bộ phận
                    // gọi tính toán trọng số quy đổi cho bộ phận đó

                    // đây là mlmt đẻ tính trọng số kiểu ttmlmt
                    let isMLMT = organization_id === 1 || organization_id === 2;
                    // Cập nhập trọng số quy đổi theo kiểu phân cấp hình cây
                    depFunc.updateWeightPercentDepartment(key, isMLMT);

                }
                message = "Thực hiện xong "
            } catch (e) {
                console.log("Lỗi tổng quát", e);
                message = "Lỗi thực hiện"
            }
        }
        // chuyển tất cả trạng thái bsc_kpi từ bản đồ, đến phân rã, cho đến gán đơn vị, và gán đến chức danh và cá nhân
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: "OK", message }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
            , 2
        ));
    }

    // upload xác định trọng số của bộ KPI của đơn vị
    async uploadDepartmentsKpiWeight(req, res, next) {
        // console.log('lấy được', req.json_data);
        let message;
        let { organization_id, data } = req.json_data;

        // phải tổ chức của đơn vị user đang quản lý nhé

        if (organization_id && data && Array.isArray(data)) {
            try {
                let departmentIds = arrObj.convertArrayToObjects(data, 'department_id')
                for (let key in departmentIds) {

                    let oneDepartmentKpis = departmentIds[key];

                    for (let idx = 0; idx < oneDepartmentKpis.length; idx++) {
                        let updatedUK = oneDepartmentKpis[idx];
                        // thực hiện update như trên
                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                        // chỉ update tên, ... chỉ tiêu khác thôi
                        let jsonUpdate = {
                            id: updatedUK.department_kpi_id
                            , seperated_weight: updatedUK.seperated_weight
                            , self_weight: updatedUK.self_weight || 0.5    // nếu không tự xác định thì gán 0.5
                            , weight: updatedUK.seperated_weight * (updatedUK.self_weight || 0.5)
                            , status: 1 // kích hoạt lại trạng thái hoạt động
                        }
                        await db.update(db.convertSqlFromJson("departments_kpi", jsonUpdate, ["id"]))
                    }
                    // đã tổ chức xong kpi cho 1 bộ phận
                    // gọi tính toán trọng số quy đổi cho bộ phận đó

                    // đây là mlmt đẻ tính trọng số kiểu ttmlmt
                    let isMLMT = organization_id === 1 || organization_id === 2;
                    // Cập nhập trọng số quy đổi theo kiểu phân cấp hình cây
                    depFunc.updateWeightPercentDepartment(key, isMLMT);

                }
                message = "Thực hiện xong "
            } catch (e) {
                console.log("Lỗi tổng quát", e);
                message = "Lỗi thực hiện"

            }
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: "OK", message }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
            , 2
        ));
    }

    // upload cây phân rã kpi cho chức danh
    async uploadSeperatedRole(req, res) {

        let message;

        try {
            let { organization_id, data } = req.json_data;
            // console.log('lấy được', organizationId);

            if (organization_id && data && Array.isArray(data)) {
                // chuyển đổi cây trước khi chèn vào để đảm bảo có mã parent
                let resultsUK = arrObj.convertArrayToObjects(data, "department_kpi_id")

                // lấy mã id cực đại cho trước
                let { maxId } = await db.getRst(`select max(id) as maxId from seperated_roles_kpi`)

                let newIndex = maxId || 0; // khởi tạo index mới nếu có
                // lấy được danh sách department_kpi_id đã phân rã trong cây truyền lên
                let roleIds = Object.keys(resultsUK);

                // truy vấn dữ liệu lấy cây dã phân rã trước cho map truyền lên này
                // -- mã kpi gốc đã phân rã
                let seperatedRoles = await db.getRsts(
                    `select *
                     from seperated_roles_kpi
                        where department_kpi_id in (${roleIds.toString()})
                     `)

                // lấy danh sách kpi của bộ phận để lấy trọng số giao và các thông tin đơn vị tính, cách tính..
                let departmentKpis = await db.getRsts(
                    `select *
                     from departments_kpi
                        where id in (${roleIds.toString()})
                     `)

                // đối tượng này chứa mã id của kpi của bộ phận
                let departmentKpisUK = arrObj.convertArrayToObject(departmentKpis, "id")
                // console.log('seperated', seperatedRoles);
                // chuyển đổi thành uk cho danh sách đã phân rã trước để tham chiếu nhanh hơn
                let seperatedRolesUK = arrObj.convertArrayToObjects(seperatedRoles, "department_kpi_id")

                // bây giờ ta duyệt mã của từng vai trò
                for (let key in resultsUK) {

                    let jobRoles = resultsUK[key] || [];
                    // lấy gốc cây trước (nếu tìm thấy được)
                    // console.log('tim vai trò chức danh',jobRoles);

                    // mệnh đề này sẽ ưu tiên lấy C đã có mã id>0 được truyền lên
                    let getC = jobRoles.find(x => x.kpi_role === "C" && x.id > 0 && !x.parent_id)
                        || jobRoles.find(x => x.kpi_role === "C" && x.id > 0)
                        || jobRoles.find(x => x.kpi_role === "C");


                    // nếu tìm thấy vai trò chủ trì mới tổ chức cây phân rã
                    // và đã gán cho đơn vị chủ trì nào đó
                    if (getC && getC.job_role_id) {
                        // gốc cây thật sự -- tìm ra các bộ phận đã phân rã chưa
                        // đã phân rã cho bộ phận này chưa
                        // tìm kiếm id tồn tại đã lưu trong csdl của bộ phận tương ứng
                        // ưu tiên có vai trò C, là gốc cây trước đó --> vai trò C không phải gốc cây --> vai trò khác nếu có
                        let savedRoles = seperatedRolesUK[key] || [];

                        // console.log('tim bo phan',savedDepartments);

                        let getCSave =
                            savedRoles.find(x => x.job_role_id === getC.job_role_id && x.kpi_role === "C" && !x.parent_id)
                            || savedRoles.find(x => x.job_role_id === getC.job_role_id && x.kpi_role === "C")
                            || savedRoles.find(x => x.job_role_id === getC.job_role_id);


                        let isUpdateC = getC.id > 0 ? true : getCSave ? true : false;
                        getC.id = getC.id > 0 ? getC.id : getCSave ? getCSave.id : ++newIndex;
                        getC.parent_id = undefined; // reset 

                        // lấy kpi hiện có của bộ phận để gán thông tin
                        let depKpi = departmentKpisUK[getC.department_kpi_id];

                        // mã gốc cây chủ trì
                        let dataJson = {
                            id: getC.id
                            , organization_id: getC.organization_id
                            , department_kpi_id: getC.department_kpi_id
                            , job_role_id: getC.job_role_id
                            , kpi_role: getC.kpi_role
                            , name: getC.name
                            , weight: getC.weight || depKpi.weight
                            , parent_weight_percent: getC.weight || depKpi.weight
                            , unit: getC.unit || depKpi.unit
                            , calculating_description: getC.calculating_description || depKpi.calculating_description
                            , frequency_review: getC.frequency_review || depKpi.frequency_review
                            , frequency_record: getC.frequency_record || depKpi.frequency_record
                            , status: 1
                        }

                        if (isUpdateC) {
                            dataJson.updated_time = Date.now();
                            let rt = await db.update(arrObj.convertSqlFromJson("seperated_roles_kpi", dataJson, ["id"]));
                            // console.log('Update C', rt);
                        } else {
                            dataJson.created_time = Date.now();
                            let rt = await db.insert(arrObj.convertSqlFromJson("seperated_roles_kpi", dataJson, []));
                            // console.log('insert id C', rt);
                        }

                        // phân rã tiếp các lá cây tiếp theo lấy gốc cây đã làm ở trên
                        for (let idx = 0; idx < jobRoles.length; idx++) {
                            let el = jobRoles[idx];
                            // chỉ vai trò trực tiếp
                            // if (el.id === 196)
                            //     console.log(el, getC);
                            // hoặc chủ trì mà không phải phòng gốc (mà mã id khác với g gốc) đều là phân rã con hết
                            if (el.kpi_role !== "C"
                                || (el.kpi_role === "C"
                                    && (el.job_role_id !== getC.job_role_id
                                        // hoặc phòng gốc nhưng mã id khác (tức thêm một C con nữa)
                                        || (el.job_role_id === getC.job_role_id && el.id != getC.id))
                                )) {

                                // if (el.id === 196)
                                //     console.log("****> vào đây");

                                // trường hợp có id truyền lên thì thực hiện update
                                let isUpdateTr = el.id > 0;
                                // trường hợp không có id truyền lên thì
                                // nếu tìm thấy mã đơn lẻ trong csdl thì lấy mã đó update
                                // nếu nhiều mã trong csdl thì ko cho phép
                                // nếu có mã parent_id truyền lên mà trùng với mã gốc 
                                // thì tạo mới tự động để chèn vào
                                // nếu không tìm thấy đơn lẻ trong csdl thì chèn mới vào
                                if (!isUpdateTr) {
                                    // tìm mã trực tiếp đã lưu vào csdl chưa
                                    // tránh bảng ghi trực tiếp vừa cập nhập ở trên
                                    let getTrSaves = await db.getRsts(
                                        `select id, parent_id, department_kpi_id, kpi_role, name 
                                        from seperated_roles_kpi
                                            where department_kpi_id = ${el.department_kpi_id}   -- mã kpi của đơn vị  
                                            and job_role_id = ${el.job_role_id} -- chức danh này có chưa?
                                            and id <> ${getC.id}
                                        `)

                                    // console.log('Số bản ghi', getTrSaves);

                                    if (getTrSaves && getTrSaves.length > 0) {
                                        // ưu tiên nếu lưu trùng tên trước đó thì update
                                        let oldName = getTrSaves.find(x => x.name === el.name);
                                        if (oldName) {
                                            el.id = oldName.id;
                                            isUpdateTr = true;
                                        } else if (el.parent_id === getC.id) {
                                            // nếu có mã cấp cha trùng với cấy gốc thì cho chèn vào
                                            el.id = ++newIndex
                                        } else if (getTrSaves.length === 1) {
                                            // trường hợp chỉ có 1 bảng ghi trước đó thì update
                                            el.id = getTrSaves[0].id;
                                            isUpdateTr = true;
                                        } else {
                                            // trường hợp ko trùng tên, và nhiều hơn 1 bảng ghi tồn tại
                                            // nhưng parent_id trùng với gốc (tức có phân rã ở client theo parent)
                                            // thì cho phép tạo mới // tức có el.id >0 đó
                                            el.id = ++newIndex
                                        }
                                    } else {
                                        // chưa tồn tại bảng ghi nào của bộ phận như này trong csdl
                                        // thì cho phép chèn mới
                                        el.id = ++newIndex
                                    }
                                }

                                // mã đưa vào csdl phải >0
                                if (el.id > 0) {
                                    // mã lấy ở trên
                                    let dataJsonTr = {
                                        id: el.id
                                        , parent_id: getC.id
                                        , organization_id: el.organization_id
                                        , department_kpi_id: el.department_kpi_id
                                        , job_role_id: el.job_role_id
                                        , kpi_role: el.kpi_role
                                        , name: el.name
                                        , weight: el.weight || depKpi.weight
                                        , parent_weight_percent: el.weight || depKpi.weight
                                        , unit: el.unit || depKpi.unit
                                        , calculating_description: el.calculating_description || depKpi.calculating_description
                                        , frequency_review: el.frequency_review || depKpi.frequency_review
                                        , frequency_record: el.frequency_record || depKpi.frequency_record
                                        , status: 1
                                    }

                                    if (isUpdateTr) {
                                        dataJsonTr.updated_time = Date.now();
                                        let rt = await db.update(arrObj.convertSqlFromJson("seperated_roles_kpi", dataJsonTr, ["id"]));
                                        // console.log('Update Tr', rt);
                                    } else {
                                        dataJsonTr.created_time = Date.now();
                                        let rt = await db.insert(arrObj.convertSqlFromJson("seperated_roles_kpi", dataJsonTr, []));
                                        // console.log('insert id Tr', rt);
                                    }
                                }

                            }
                        }
                    }
                }
            }

            message = "Cập nhập thành công cây phân rã upload"

        } catch (err) {
            console.log('Lỗi uploadSeperatedMap', err);
            message = "Lỗi không xử lý được dữ liệu"
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: "OK", message }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
            , 2
        ));
    }

    // upload kpi đăng ký cho cá nhân
    async uploadStaffKpi(req, res, next) {
        let message;
        let { organization_id, period_id, data } = req.json_data;
        // console.log('lấy được', organization_id, period_id, data);
        // xử lý upload staff
        if (organization_id && period_id && data && Array.isArray(data)) {
            try {
                // chuyển đổi mã nhân sự để tạo kpi theo từng cá nhân
                let staffIds = arrObj.convertArrayToObjects(data, 'staff_id')
                // duyệt tất cả các khóa chính của cá nhân 
                for (let key in staffIds) {
                    let oneStaffKpis = staffIds[key];
                    let seperatedKpis = oneStaffKpis.filter(x => x.seperated_role_id > 0 && (x.kpi_role === "C" || x.kpi_role === "Tr"))
                    // chuyển đổi lấy mỗi mã phân rã độc lập để tạo kpi duy nhất
                    let seperatedKpisUK = arrObj.convertArrayToObject(seperatedKpis, "seperated_role_id")
                    // lọc lấy kpi bổ sung bsc_id=24
                    let privateKpis24 = oneStaffKpis.filter(x => !x.seperated_role_id && (x.kpi_role === "R" || x.kpi_role === "Ts"))
                    // lọc lấy kpi tinh thần và thái độ làm việc bsc_id=25
                    let privateKpis25 = oneStaffKpis.filter(x => !x.seperated_role_id && x.kpi_role === "Tz")
                    // kiểm tra gốc cây của nhân viên đã tạo chưa? nếu chưa thì tạo trước để gán và update toàn bộ kpi về 0
                    let ok = await createFunc.createRootStaff(organization_id, key);

                    // lấy kpi từ csdl ra (trường có tên là seperated_map_id)
                    let curStaffKpi = await createFunc.getStaffKpiTree(key);
                    // tạo cây kpi của nhân viên
                    let curStaffKpiTree = arrObj.createTree(curStaffKpi, "id", "parent_id") || [];

                    // gọi tổ chức kpi insert và update cho cá nhân
                    // --------------- Bắt đầu duyệt để chèn vào gốc cây ----------
                    // duyệt tất cả gốc cây đã tạo trong csdl
                    for (let iroot = 0; iroot < curStaffKpiTree.length; iroot++) {
                        let rootEl = curStaffKpiTree[iroot];
                        let children = rootEl.$children;
                        // console.log("length?", rootEl);
                        // nếu cây tạo mà có kpi đã tạo rồi
                        if (children && Array.isArray(children)) {
                            if (rootEl.bsc_id === 23) {
                                // cây phân rã cho cá nhân
                                for (let i = 0; i < children.length; i++) {
                                    let kpi = children[i];
                                    let updatedUK = seperatedKpisUK[kpi.seperated_role_id];
                                    if (updatedUK) {
                                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                                        // chỉ update tên, ... chỉ tiêu khác thôi
                                        let jsonUpdate = {
                                            id: kpi.id
                                            , name: updatedUK.kpi_name || kpi.name
                                            , kpi_role: updatedUK.kpi_role
                                            , seperated_weight: updatedUK.seperated_weight || kpi.seperated_weight
                                            , self_weight: updatedUK.self_weight || kpi.self_weight || 0.5
                                            , weight: (updatedUK.seperated_weight || kpi.seperated_weight) * (updatedUK.self_weight || kpi.self_weight || 0.5) || 1
                                            , calculating_description: updatedUK.calculating_description || kpi.calculating_description
                                            , unit: updatedUK.unit || kpi.unit
                                            , target: updatedUK.target || kpi.target
                                            , status: 1 // kích hoạt lại trạng thái hoạt động
                                        }
                                        await db.update(db.convertSqlFromJson("staffs_kpi", jsonUpdate, ["id"]))
                                        // xóa key đã trùng này trong seperatedKpisUK để không chèn mới nữa
                                        delete seperatedKpisUK[kpi.seperated_role_id]
                                    } else if (kpi.status) { // trạng thái hoạt động thì update về 0
                                        // không truyền lên (thì update trạng thái về 0 nhé)
                                        await db.update(db.convertSqlFromJson("staffs_kpi", { id: kpi.id, status: 0 }, ["id"]))
                                    }
                                }
                                // còn lại các phân rã mới chưa có trong csdl
                                for (let sepKey in seperatedKpisUK) {
                                    let el = seperatedKpisUK[sepKey]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: rootEl.organization_id
                                        , staff_id: el.staff_id
                                        , job_role_id: el.job_role_id
                                        , seperated_role_id: el.seperated_role_id
                                        , kpi_role: el.kpi_role
                                        , name: el.kpi_name
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: (el.seperated_weight * (el.self_weight || 0.5)) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("staffs_kpi", jsonInsert))
                                }

                                // console.log("end seperatedKpisUK");
                            }

                            if (rootEl.bsc_id === 24) {
                                // cây riêng
                                for (let i = 0; i < children.length; i++) {
                                    let kpi = children[i];

                                    // tìm kiếm kpi đã chèn vào trước đó chưa
                                    let indexPrivate = privateKpis24.findIndex(x => x.kpi_name === kpi.name || x.staff_kpi_id === kpi.id)

                                    // console.log("INDEX TÌM", indexPrivate );
                                    // nếu đã chèn trước rồi (trùng tên hoặc mã đã tạo)
                                    if (indexPrivate >= 0) {
                                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                                        // chỉ update tên, ... chỉ tiêu khác thôi
                                        let updatedUK = privateKpis24[indexPrivate];
                                        // thực hiện update như trên

                                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                                        // chỉ update tên, ... chỉ tiêu khác thôi
                                        let jsonUpdate = {
                                            id: kpi.id
                                            , name: updatedUK.kpi_name || kpi.name
                                            , kpi_role: updatedUK.kpi_role
                                            , seperated_weight: updatedUK.seperated_weight || kpi.seperated_weight
                                            , self_weight: updatedUK.self_weight || kpi.self_weight || 0.5
                                            , weight: (updatedUK.seperated_weight || kpi.seperated_weight) * (updatedUK.self_weight || kpi.self_weight || 0.5) || 1
                                            , calculating_description: updatedUK.calculating_description || kpi.calculating_description
                                            , unit: updatedUK.unit || kpi.unit
                                            , target: updatedUK.target || kpi.target
                                            , status: 1 // kích hoạt lại trạng thái hoạt động
                                        }
                                        await db.update(db.convertSqlFromJson("staffs_kpi", jsonUpdate, ["id"]))
                                        // xóa key đã trùng này trong seperatedKpisUK để không chèn mới nữa
                                        delete seperatedKpisUK[kpi.seperated_role_id]

                                        // xóa key đã trùng này trong seperatedKpisUK để không chèn mới nữa
                                        privateKpis24.splice(indexPrivate, 1)
                                    } else if (kpi.status) { // trạng thái hoạt động thì update về 0
                                        // không truyền lên (thì update trạng thái về 0 nhé)
                                        // không truyền lên (thì update trạng thái về 0 nhé)
                                        await db.update(db.convertSqlFromJson("staffs_kpi", { id: kpi.id, status: 0 }, ["id"]))
                                    }
                                }
                                // console.log("end 22");
                                // còn lại mãng mới cần insert lên cây
                                // còn lại các phân rã mới chưa có trong csdl
                                for (let idx = 0; idx < privateKpis24.length; idx++) {
                                    let el = privateKpis24[idx]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: rootEl.organization_id
                                        , staff_id: el.staff_id
                                        , job_role_id: el.job_role_id
                                        , seperated_role_id: el.seperated_role_id
                                        , kpi_role: el.kpi_role
                                        , name: el.kpi_name
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: (el.seperated_weight * (el.self_weight || 0.5)) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("staffs_kpi", jsonInsert))
                                    console.log("Chèn Đã có cây", jsonInsert);
                                }
                                // console.log("end privateKpis");
                            }
                            if (rootEl.bsc_id === 25) {
                                // cây riêng
                                for (let i = 0; i < children.length; i++) {
                                    let kpi = children[i];

                                    // tìm kiếm kpi đã chèn vào trước đó chưa
                                    let indexPrivate = privateKpis25.findIndex(x => x.kpi_name === kpi.name || x.staff_kpi_id === kpi.id)

                                    // console.log("INDEX TÌM", indexPrivate );
                                    // nếu đã chèn trước rồi (trùng tên hoặc mã đã tạo)
                                    if (indexPrivate >= 0) {
                                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                                        // chỉ update tên, ... chỉ tiêu khác thôi
                                        let updatedUK = privateKpis25[indexPrivate];
                                        // thực hiện update như trên

                                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                                        // chỉ update tên, ... chỉ tiêu khác thôi
                                        let jsonUpdate = {
                                            id: kpi.id
                                            , name: updatedUK.kpi_name || kpi.name
                                            , kpi_role: updatedUK.kpi_role
                                            , seperated_weight: updatedUK.seperated_weight || kpi.seperated_weight
                                            , self_weight: updatedUK.self_weight || kpi.self_weight || 0.5
                                            , weight: (updatedUK.seperated_weight || kpi.seperated_weight) * (updatedUK.self_weight || kpi.self_weight || 0.5) || 1
                                            , calculating_description: updatedUK.calculating_description || kpi.calculating_description
                                            , unit: updatedUK.unit || kpi.unit
                                            , target: updatedUK.target || kpi.target
                                            , status: 1 // kích hoạt lại trạng thái hoạt động
                                        }
                                        await db.update(db.convertSqlFromJson("staffs_kpi", jsonUpdate, ["id"]))
                                        // xóa key đã trùng này trong seperatedKpisUK để không chèn mới nữa
                                        delete seperatedKpisUK[kpi.seperated_role_id]

                                        // xóa key đã trùng này trong seperatedKpisUK để không chèn mới nữa
                                        privateKpis25.splice(indexPrivate, 1)
                                    } else if (kpi.status) { // trạng thái hoạt động thì update về 0
                                        // không truyền lên (thì update trạng thái về 0 nhé)
                                        // không truyền lên (thì update trạng thái về 0 nhé)
                                        await db.update(db.convertSqlFromJson("staffs_kpi", { id: kpi.id, status: 0 }, ["id"]))
                                    }
                                }
                                // còn lại mãng mới cần insert lên cây
                                // còn lại các phân rã mới chưa có trong csdl
                                for (let idx = 0; idx < privateKpis25.length; idx++) {
                                    let el = privateKpis25[idx]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: rootEl.organization_id
                                        , staff_id: el.staff_id
                                        , job_role_id: el.job_role_id
                                        , seperated_role_id: el.seperated_role_id
                                        , kpi_role: el.kpi_role
                                        , name: el.kpi_name
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: (el.seperated_weight * (el.self_weight || 0.5)) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("staffs_kpi", jsonInsert))
                                    console.log("Chèn Đã có cây", jsonInsert);
                                }
                                // console.log("end privateKpis");
                            }
                        } else {
                            // don vi do chua co gi thi chen moi hoan toan, ke ca truyen len id
                            if (rootEl.bsc_id === 23) {
                                // cây phân rã
                                for (let sepKey in seperatedKpisUK) {
                                    let el = seperatedKpisUK[sepKey]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: rootEl.organization_id
                                        , staff_id: el.staff_id
                                        , job_role_id: el.job_role_id
                                        , seperated_role_id: el.seperated_role_id
                                        , kpi_role: el.kpi_role
                                        , name: el.kpi_name
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: (el.seperated_weight * (el.self_weight || 0.5)) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("staffs_kpi", jsonInsert))
                                }
                                // console.log("end seperatedKpisUK");
                            }

                            if (rootEl.bsc_id === 24) {
                                // cây riêng
                                // còn lại các phân rã mới chưa có trong csdl
                                for (let idx = 0; idx < privateKpis24.length; idx++) {
                                    let el = privateKpis24[idx]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: rootEl.organization_id
                                        , staff_id: el.staff_id
                                        // , job_role_id: el.job_role_id
                                        // , seperated_role_id: el.seperated_role_id
                                        , kpi_role: el.kpi_role
                                        , name: el.kpi_name
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: (el.seperated_weight * (el.self_weight || 0.5)) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("staffs_kpi", jsonInsert))
                                    // console.log("Chèn chưa có cây 24", jsonInsert);
                                }
                            }
                            if (rootEl.bsc_id === 25) {
                                // cây riêng
                                // còn lại các phân rã mới chưa có trong csdl
                                for (let idx = 0; idx < privateKpis25.length; idx++) {
                                    let el = privateKpis25[idx]
                                    // thực hiện chèn mới vào csdl ngay
                                    let jsonInsert = {
                                        parent_id: rootEl.id
                                        , organization_id: rootEl.organization_id
                                        , staff_id: el.staff_id
                                        // , job_role_id: el.job_role_id
                                        // , seperated_role_id: el.seperated_role_id
                                        , kpi_role: el.kpi_role
                                        , name: el.kpi_name
                                        , seperated_weight: el.seperated_weight
                                        , self_weight: el.self_weight || 0.5
                                        , weight: (el.seperated_weight * (el.self_weight || 0.5)) || 1
                                        , calculating_description: el.calculating_description
                                        , unit: el.unit
                                        , target: el.target
                                        , status: 1 // kích hoạt lại trạng thái hoạt động
                                    }
                                    await db.insert(db.convertSqlFromJson("staffs_kpi", jsonInsert))
                                    // console.log("Chèn chưa có cây 25", jsonInsert);
                                }
                            }
                        }
                    }

                    // đã tổ chức xong kpi cho 1 cá nhân
                    // gọi tính toán trọng số quy đổi cho cá nhân đó

                    // đây là mlmt đẻ tính trọng số kiểu ttmlmt
                    let isMLMT = organization_id === 1 || organization_id === 2;
                    // Cập nhập trọng số quy đổi theo kiểu phân cấp hình cây
                    staffFunc.updateWeightPercentStaff(key, isMLMT);

                }
                message = "Thực hiện xong "
            } catch (e) {
                console.log("Lỗi tổng quát", e);
                message = "Lỗi thực hiện"
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: "OK", message }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
            , 2
        ));
    }

    // upload trọng số của cá nhân
    async uploadStaffKpiWeight(req, res, next) {
        let message;
        let { organization_id, data } = req.json_data;
        console.log('lấy được', organization_id, data);

        if (organization_id && data && Array.isArray(data)) {
            try {
                let staffIds = arrObj.convertArrayToObjects(data, 'staff_id')
                for (let key in staffIds) {

                    let oneStaffKpis = staffIds[key];

                    for (let idx = 0; idx < oneStaffKpis.length; idx++) {
                        let updatedUK = oneStaffKpis[idx];
                        // thực hiện update như trên
                        // đây là kpi có tồn tại trong csdl đã phân rã rồi, id chính là kpi.id 
                        // chỉ update tên, ... chỉ tiêu khác thôi
                        let jsonUpdate = {
                            id: updatedUK.staff_kpi_id
                            , seperated_weight: updatedUK.seperated_weight
                            , self_weight: updatedUK.self_weight || 0.5    // nếu không tự xác định thì gán 0.5
                            , weight: updatedUK.seperated_weight * (updatedUK.self_weight || 0.5)
                            , status: 1 // kích hoạt lại trạng thái hoạt động
                        }
                        await db.update(db.convertSqlFromJson("staffs_kpi", jsonUpdate, ["id"]))
                    }
                    // đã tổ chức xong kpi cho 1 bộ phận
                    // gọi tính toán trọng số quy đổi cho bộ phận đó

                    // đây là mlmt đẻ tính trọng số kiểu ttmlmt
                    let isMLMT = organization_id === 1 || organization_id === 2;
                    // Cập nhập trọng số quy đổi theo kiểu phân cấp hình cây
                    staffFunc.updateWeightPercentStaff(key, isMLMT);

                }
                message = "Thực hiện xong "
            } catch (e) {
                console.log("Lỗi tổng quát", e);
                message = "Lỗi thực hiện"

            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: "OK", message }
            , (key, value) => {
                if (value === null) { return undefined; }
                return value;
            }
            , 2
        ));
    }

}

module.exports = new Handler()