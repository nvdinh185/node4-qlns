"use strict"
/**
 * Bộ xử lý lấy các danh sách sql phục vụ xuất file excel mẫu
 * Quy ước: từ bản đồ chiến lược
 * Nhiệm vụ Chủ trì = C
 * Nhiệm vụ Trực tiếp = Tr
 * Quy ước bổ sung thêm:
 * Nhiệm vụ bổ sung theo chức năng nhiệm vụ là R ==> Ts
 * Nhiệm vụ bổ sung theo tinh thần và thái độ làm việc là Tz
 */
const arrObj = require('../../../utils/array-object');
const db = require('../../../db/sqlite3/db-pool');

class Handler {

    // Lấy ds giai đoạn của tổ chức
    getCurPeriods(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        // console.log('tét', orgId, periodId);
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  * 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id
            )
         select a.* from strategy_period a, cur_period b
         where a.id = b.id`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //1. lấy giai đoạn hiện tại hoặc một giai đoạn nào đó
    getCurPeriod(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;  // mã chu kỳ
        // console.log('tét', orgId, periodId);
        db.getRst(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            )
         select a.* from strategy_period a, cur_period b
         where a.id = b.id`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //2. Lấy bảng đồ chiến lược cho giai đoạn hiện tại
    getCurStrategyMap(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;  // mã chu kỳ
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            ),
        -- gốc bảng đồ
        cur_root_map as
            (select a.* from strategy_map a, cur_period b, cur_organization c
            where a.bsc_id is not null 
            and a.organization_id = c.id 
            and a.period_id = b.id)
            ,
        -- bảng đồ chiến lược hiện tại
        cur_map as
            (WITH RECURSIVE under_tree AS 
            (select a.* from cur_root_map a
            UNION ALL
            SELECT b.* FROM strategy_map b 
            JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree
            )
        -----------------------------
        select * from cur_map`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //3. (*) phân rã cho giai đoạn hiện tại cho Bộ phận
    // dùng để in ds chiều H và chiều V
    getCurSeperatedMap(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;  // mã chu kỳ
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            ),
         cur_root_map as
            (select a.* from strategy_map a, cur_period b, cur_organization c
            where a.bsc_id is not null 
            and a.organization_id = c.id
            and a.period_id = b.id)
            ,
         cur_map as
            (WITH RECURSIVE under_tree AS 
            (select a.* from cur_root_map a
            UNION ALL
            SELECT b.* FROM strategy_map b 
            JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree
            where is_leaf=1 and depth = 3
            ),
        -- bảng phân rã
        cur_seperated as
            (select a.* from seperated_map_kpi a, cur_map b
            where a.map_id = b.id)
        ---------------------------------------
        select * from cur_seperated`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //4. kpi bộ phận được phân rã cần khai báo chọ để gán
    // kết hợp giữa đã giao và đã phân rã (chưa giao) --> dùng để giao kpi
    getCurDepartmentKpiCTr(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                             // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;              // mã chu kỳ
        let departmentId = isNaN(req.paramS.department_id) ? 0 : req.paramS.department_id   // mã bộ phận cần xem
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            ),
        -- danh sách các bộ phận thuộc công ty/Trung tâm
        cur_department as
            (WITH RECURSIVE under_tree AS (
                select a.* from organizations a, cur_organization cur
                where a.id=cur.id
                UNION ALL
                SELECT b.*
                FROM organizations b 
                JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1, id)
            SELECT * FROM under_tree),
        -- danh sách bộ gốc bsc_kpi
        cur_root_map as
            (select a.* from strategy_map a, cur_period b, cur_organization c
            where a.bsc_id is not null 
            and a.organization_id = c.id
            and a.period_id = b.id),
        -- danh sách bản đồ hiện tại
        cur_map as
            (WITH RECURSIVE under_tree AS 
            (select a.* from cur_root_map a
            UNION ALL
            SELECT b.* FROM strategy_map b 
            JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree),
         -- danh sách phân rã hiện tại
        cur_seperated as
            (select a.* from seperated_map_kpi a, cur_map b
            where a.map_id = b.id),
        -- danh sách kpi gán cho bộ phận
        cur_department_C_Tr as
            (
            select
                b.id,
                b.parent_id,
                a.organization_id,
                c.name as department_name,
                a.id as seperated_map_id,
                a.map_id,
                a.kpi_role,
                IFNULL(b.name,a.name) as name,
                IFNULL(b.seperated_weight, a.weight) as seperated_weight,                         -- trọng số được giao
                IFNULL(b.self_weight, 0) as self_weight,                                         -- Trọng số tự xác định
                IFNULL(b.weight, 0) as weight,                                                   -- Trọng số tích hợp chính = trọng số được giao ban đầu = 0
                IFNULL(b.weight_percent, a.weight_percent) as weight_percent,                     -- trọng số % quy đổi theo nhánh (bỏ trong trường hợp MLMT)
                IFNULL(b.parent_weight_percent, a.parent_weight_percent) as parent_weight_percent, -- Trọng số cấp trên (bỏ trong trường hợp MLMT)
                IFNULL(b.root_weight_percent, a.root_weight_percent) as root_weight_percent,       -- trọng số quy đổi % ( * 100 = điểm quy đổi)
                IFNULL(b.unit, a.unit) as unit,
                IFNULL(b.calculating_description, a.calculating_description) as calculating_description,
                IFNULL(b.operator_method, a.operator_method) as operator_method,
                IFNULL(b.target_limit, a.target_limit) as target_limit,
                IFNULL(b.target, a.target) as target,
                IFNULL(b.result_min_limit, a.result_min_limit) as result_min_limit,
                IFNULL(b.result_max_limit, a.result_max_limit) as result_max_limit,
                IFNULL(b.frequency_review, a.frequency_review) as frequency_review,
                IFNULL(b.frequency_record, a.frequency_record) as frequency_record,
                a.status as kpi_status,
                IFNULL(b.status,0) as status
                from cur_seperated a
                LEFT JOIN departments_kpi b
                on a.id = b.seperated_map_id
                JOIN cur_department c 
                on a.organization_id = c.id
                order by a.kpi_role
            )
        -- lấy danh sách sẽ gán cho bộ phận
        select * from cur_department_C_Tr
        ${(departmentId ? `where organization_id =${departmentId}` : ``)}
        order by map_id, organization_id 
        `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //5. KPI riêng của bộ phận cho giai đoạn này chỉ nằm ở bảng department_kpi
    // kpi này đã được giao bằng tay hoặc upload
    getCurDepartmentKpiR(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;  // mã chu kỳ
        let departmentId = isNaN(req.paramS.department_id) ? 0 : req.paramS.department_id   // mã bộ phận cần xem
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            ),
        -- danh sách các bộ phận thuộc công ty/Trung tâm
         cur_department as
            (WITH RECURSIVE under_tree AS (
                select a.* from organizations a, cur_organization cur
                where a.id=cur.id
                UNION ALL
                SELECT b.*
                FROM organizations b 
                JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1, id)
            SELECT * FROM under_tree),
        cur_department_R as
            (WITH RECURSIVE under_tree AS (
            select a.* from departments_kpi a, cur_department b
            where a.bsc_id in (22)
            and a.organization_id = b.id
            UNION ALL
            SELECT b.*
                FROM departments_kpi b 
                JOIN under_tree 
                ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree
            where parent_id is not null)
        -- lấy danh sách cụ thể
        select b.name as department_name, a.* from cur_department_R a, cur_department b
		where a.organization_id = b.id
        ${(departmentId ? `and organization_id =${departmentId}` : ``)}
        `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //6. (**) Lấy bảng kpi cấp phòng để giao trọng số -- kết quả đã giao tất cả
    // hoặc dùng cho đầu vào cho vai trò chức danh
    // xuất ra danh sách chiều H hoặc chiều V cho seperated_role
    // CHỈ lấy Lá cây
    getCurDepartmentsKpi(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;  // mã chu kỳ
        let departmentId = isNaN(req.paramS.department_id) ? 0 : req.paramS.department_id   // mã bộ phận cần xem
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            ),
        -- danh sách các bộ phận thuộc công ty/Trung tâm
        cur_department as
            (WITH RECURSIVE under_tree AS (
                select a.* from organizations a, cur_organization cur
                where a.id=cur.id
                UNION ALL
                SELECT b.*
                FROM organizations b 
                JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1, id)
            SELECT * FROM under_tree),
        -- danh sách bộ gốc bsc_kpi
        cur_root_map as
            (select a.* from strategy_map a, cur_period b, cur_organization c
            where a.bsc_id is not null 
            and a.organization_id = c.id 
            and a.period_id = b.id),
            -- danh sách bản đồ hiện tại
            cur_map as
            (WITH RECURSIVE under_tree AS 
            (select a.* from cur_root_map a
            UNION ALL
            SELECT b.* FROM strategy_map b 
            JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree),
            -- danh sách phân rã hiện tại
        cur_seperated as
            (select a.* from seperated_map_kpi a, cur_map b
            where a.map_id = b.id),
        -- bộ kpi được phân rã và đã giao đến cho phòng ban, bộ phận
        cur_department_C_Tr as
            (SELECT a.*
                FROM departments_kpi a, cur_seperated b
                WHERE a.seperated_map_id = b.id
            ORDER BY kpi_role),
        -- kpi theo chức năng nhiệm vụ bổ sung riêng thêm
        cur_department_R as
            (WITH RECURSIVE under_tree AS (
            select a.* from departments_kpi a, cur_department b
            where a.bsc_id in (22)
            and a.organization_id = b.id
            UNION ALL
            SELECT b.*
                FROM departments_kpi b 
                JOIN under_tree 
                ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree
            where parent_id is not null),
        -- danh sách kpi của đơn vị phòng ban được giao đầy đủ bằng kpi phân rã xuống và kpi theo chức năng nhiệm vụ
        cur_department_kpi_all as
            (select * from cur_department_C_Tr
            UNION ALL
            select * from cur_department_R
            ORDER by kpi_role)
        --  danh sách lấy kpi cấp phòng chi tiết (không có gốc cây nhé)
        select b.name as department_name, a.* from cur_department_kpi_all a, cur_department b
            where a.organization_id = b.id
            ${(departmentId ? `and organization_id =${departmentId}` : ``)}
            order by a.kpi_role, a.organization_id
        `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //7. (*) 1. lấy bảng phân rã cho vai trò chức danh
    // Sử dụng để in ra kết quả chiều H và chiều V cho seperated_role
    getCurSeperatedRole(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;  // mã chu kỳ
        let departmentId = isNaN(req.paramS.department_id) ? 0 : req.paramS.department_id   // mã bộ phận cần xem
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            ),
        -- danh sách các bộ phận thuộc công ty/Trung tâm
        cur_department as
            (WITH RECURSIVE under_tree AS (
                select a.* from organizations a, cur_organization cur
                where a.id=cur.id
                UNION ALL
                SELECT b.*
                FROM organizations b 
                JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1, id)
            SELECT * FROM under_tree),
        -- danh sách bộ gốc bsc_kpi của Tổ chức tại giai đoạn hiện tại
        cur_root_map as
            (select a.* from strategy_map a, cur_period b, cur_organization c
            where a.bsc_id is not null 
            and a.organization_id = c.id 
            and a.period_id = b.id),
        -- danh sách bản đồ hiện tại
        cur_map as
            (WITH RECURSIVE under_tree AS 
            (select a.* from cur_root_map a
            UNION ALL
            SELECT b.* FROM strategy_map b 
            JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree),
        -- danh sách phân rã hiện tại
        cur_seperated as
            (select a.* from seperated_map_kpi a, cur_map b
            where a.map_id = b.id),
        -- bộ kpi được phân rã và đã giao đến cho phòng ban, bộ phận
        cur_department_C_Tr as
            (SELECT a.*
                FROM departments_kpi a, cur_seperated b
                WHERE a.seperated_map_id = b.id
            ORDER BY kpi_role),
        -- kpi rieng cua bo phan
        cur_department_R as
            (WITH RECURSIVE under_tree AS (
            select a.* from departments_kpi a, cur_department b
            where a.bsc_id in (22)
            and a.organization_id = b.id
            UNION ALL
            SELECT b.*
                FROM departments_kpi b 
                JOIN under_tree 
                ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree
            where parent_id is not null),
        -- danh sách kpi của đơn vị phòng ban được giao đầy đủ bằng kpi phân rã xuống và kpi theo chức năng nhiệm vụ
        cur_department_kpi_all as
            (select * from cur_department_C_Tr
            UNION ALL
            select * from cur_department_R
            ORDER by kpi_role),
        -- bảng đã phân rã cho chức danh của phòng 
        cur_department_role as
            (select b.kpi_role as department_role
                , a.*  
                from seperated_roles_kpi a, cur_department_kpi_all b
            WHERE a.department_kpi_id = b.id)
        -- câu lệnh lấy danh sách cụ thể 
        -- bảng này sẽ ghi kết quả ở các job_role_id nằm ngang (và phân rã vai trò ngang)
        -- các dữ liệu dọc sẽ lấy câu lệnh trước getCurDepartmentsKpi
        select 
        b. name as department_name
        , c.name as job_role_name
		, a.* 
        from cur_department_role a, cur_department b
        LEFT JOIN job_roles c 
        on a.job_role_id = c.id
        where a.organization_id = b.id
        ${(departmentId ? `and a.organization_id =${departmentId}` : ``)}
		order by b.order_1, a.department_role, a.job_role_id, a.kpi_role
        `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //7. 2. Lấy danh sách KPI sau khi phân rã bước trên, in ra danh sách chiều V theo nhân viên
    // trong file excel, người dùng có thể xóa (không được thêm, chỉ xóa thôi) 
    // - để xác định kpi được giao xuống cho nhân viên này từ bản đồ chiến lược
    getCurStaffKpiCTr(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;  // mã chu kỳ
        let departmentId = isNaN(req.paramS.department_id) ? 0 : req.paramS.department_id   // mã bộ phận cần xem
        let staffId = isNaN(req.paramS.staff_id) ? 0 : req.paramS.staff_id   // mã nhân viên cần xem
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            ),
        -- danh sách các bộ phận thuộc công ty/Trung tâm
        cur_department as
            (WITH RECURSIVE under_tree AS (
                select a.* from organizations a, cur_organization cur
                where a.id=cur.id
                UNION ALL
                SELECT b.*
                FROM organizations b 
                JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1, id)
            SELECT * FROM under_tree),
        -- danh sách bộ gốc bsc_kpi của Tổ chức tại giai đoạn hiện tại
        cur_root_map as
            (select a.* from strategy_map a, cur_period b, cur_organization c
            where a.bsc_id is not null 
            and a.organization_id = c.id 
            and a.period_id = b.id),
        -- danh sách bản đồ hiện tại
        cur_map as
            (WITH RECURSIVE under_tree AS 
            (select a.* from cur_root_map a
            UNION ALL
            SELECT b.* FROM strategy_map b 
            JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree),
         -- danh sách phân rã hiện tại
        cur_seperated as
            (select a.* from seperated_map_kpi a, cur_map b
            where a.map_id = b.id),
        -- bộ kpi được phân rã và đã giao đến cho phòng ban, bộ phận
        cur_department_C_Tr as
            (SELECT a.*
                FROM departments_kpi a, cur_seperated b
                WHERE a.seperated_map_id = b.id
            ORDER BY kpi_role),
        -- kpi rieng cua bo phan từ chức năng nhiệm vụ bổ sung vào
        cur_department_R as
            (WITH RECURSIVE under_tree AS (
            select a.* from departments_kpi a, cur_department b
            where a.bsc_id in (22)
            and a.organization_id = b.id
            UNION ALL
            SELECT b.*
                FROM departments_kpi b 
                JOIN under_tree 
                ON b.parent_id = under_tree.id
            ORDER BY order_1)
            select * from under_tree
            where parent_id is not null),
        -- danh sách kpi của đơn vị phòng ban được giao đầy đủ bằng kpi phân rã xuống và kpi theo chức năng nhiệm vụ
        cur_department_kpi_all as
            (select * from cur_department_C_Tr
            UNION ALL
            select * from cur_department_R
            ORDER by kpi_role),
        -- bảng đã phân rã cho chức danh của phòng 
        cur_department_role as
            (select 
            b.kpi_role as department_role
            , a.* 
            from seperated_roles_kpi a, cur_department_kpi_all b
            WHERE a.department_kpi_id = b.id),
        -- câu lệnh chuyển đổi chuỗi thành các dòng cách nhau bởi dấu , để lấy danh sách việc kiêm nhiệm
        cur_job_ext as
            (WITH RECURSIVE split(id, job_id_ext, rest) AS (
                    SELECT id,'', substr(job_list, 2, instr(job_list,']')-2) || ','
                    FROM staffs
                    UNION ALL
                    SELECT  
                    id,
                    substr(rest, 0, instr(rest, ',')),
                    substr(rest, instr(rest, ',')+1)
                    FROM split
                    WHERE rest <> '')
            SELECT id, job_id_ext
            FROM split
            WHERE job_id_ext <> ''),
        -- danh sách chức danh + kiêm nhiệm của một nhân sự
        cur_staff_job as 
            (
            select id, job_id from staffs
            UNION ALL
            select id, job_id_ext as job_id from cur_job_ext
            ),
		cur_seperated_role as
        (select 
            b.id as staff_id
			, b.job_id
            , c.name as staff_name
			, d.name as department_name
			, e.name as job_name
            , a.* from cur_department_role a, cur_staff_job b, staffs c, cur_department d, job_roles e
        -- do chuyển đổi chuỗi sang nên mã là chuỗi không phải số
        where ''||a.job_role_id = ''||b.job_id  
            and b.id=c.id
			and a.organization_id = d.id
			and b.job_id = e.id
		${(departmentId ? `and a.organization_id =${departmentId}` : ``)}
        ${(staffId ? `and b.id =${staffId}` : ``)}
		)
		-----------------------------------------
		select 
			b.id,
			b.parent_id,
			a.organization_id,
			a.id as seperated_role_id,
			a.department_role,
			a.staff_id,
			a.staff_name,
			a.department_name,
			a.job_role_id,
			a.job_name as job_role_name,
			a.kpi_role,
			IFNULL(b.name,a.name) as name,
			IFNULL(b.seperated_weight, a.weight) as seperated_weight,                         -- trọng số được giao
			IFNULL(b.self_weight, 0) as self_weight,                                         				-- Trọng số tự xác định
			IFNULL(b.weight, 0) as weight,                                                   				-- Trọng số tích hợp chính = trọng số được giao ban đầu = 0
			IFNULL(b.weight_percent, a.weight_percent) as weight_percent,                     -- trọng số % quy đổi theo nhánh (bỏ trong trường hợp MLMT)
			IFNULL(b.parent_weight_percent, a.parent_weight_percent) as parent_weight_percent, -- Trọng số cấp trên (bỏ trong trường hợp MLMT)
			IFNULL(b.root_weight_percent, a.root_weight_percent) as root_weight_percent,       -- trọng số quy đổi % ( * 100 = điểm quy đổi)
			IFNULL(b.unit, a.unit) as unit,
			IFNULL(b.calculating_description, a.calculating_description) as calculating_description,
			IFNULL(b.operator_method, a.operator_method) as operator_method,
			IFNULL(b.target_limit, a.target_limit) as target_limit,
			IFNULL(b.target, a.target) as target,
			IFNULL(b.result_min_limit, a.result_min_limit) as result_min_limit,
			IFNULL(b.result_max_limit, a.result_max_limit) as result_max_limit,
			IFNULL(b.frequency_review, a.frequency_review) as frequency_review,
			IFNULL(b.frequency_record, a.frequency_record) as frequency_record,
			a.status as kpi_status,
			IFNULL(b.status,0) as status
		from cur_seperated_role a
		LEFT JOIN staffs_kpi b
		on a.staff_id = b.staff_id
		and a.id = b.seperated_role_id
        order by a.organization_id, a.staff_id, a.job_id, replace(a.kpi_role,'R','Ts'), replace(a.department_role,'R','Ts')
        `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    //7. 3. Nhiệm vụ bổ sung chỉ nằm ở bảng staffs_kpi thôi
    // có 2 cách bổ sung là bổ sung nhiệm vụ theo chức năng
    // và bổ sung theo tinh thần thái độ làm việc
    getCurStaffKpiR(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;  // mã chu kỳ
        let departmentId = isNaN(req.paramS.department_id) ? 0 : req.paramS.department_id   // mã bộ phận cần xem
        let staffId = isNaN(req.paramS.staff_id) ? 0 : req.paramS.staff_id   // mã nhân viên cần xem
        // mã vai trò R, Ts, Tz
        let kpiRole = req.paramS.kpi_role;
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            ),
        -- danh sách các bộ phận thuộc công ty/Trung tâm
         cur_department as
            (WITH RECURSIVE under_tree AS (
                select a.* from organizations a, cur_organization cur
                where a.id=cur.id
                UNION ALL
                SELECT b.*
                FROM organizations b 
                JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1, id)
            SELECT * FROM under_tree),
		-- danh sách nhân viên thuộc các bộ phận ở trên
		cur_staff as
			(select b.name department_name, c.name as job_name, a.* from staffs a,  cur_department b, job_roles c
			WHERE a.organization_id = b.id
			and a.job_id = c.id),
		-- lấy ds staff_kpi của giai đoạn hiện tại
		cur_staff_kpi as
            (WITH RECURSIVE under_tree AS 
            (select a.* from staffs_kpi a, cur_staff b
                where a.bsc_id in (23,24,25)
                and a.staff_id = b.id
                UNION ALL
                SELECT b.*
                    FROM staffs_kpi b 
                    JOIN under_tree 
                    ON b.parent_id = under_tree.id
                    AND b.status=1
                ORDER BY order_1)
            select * from under_tree
            where parent_id is not null
            ),
		-- ds kpi rieng
		cur_staff_kpi_Ts as
            (select 
            b.name as staff_name
            , b.department_name
            , b.job_name
            , a.* 
            from cur_staff_kpi a, cur_staff b
            where a.staff_id = b.id
            and a.kpi_role in ('Ts', 'R', 'Tz')
            ${(departmentId ? `and a.organization_id =${departmentId}` : ``)}
            ${(staffId ? `and a.staff_id =${staffId}` : ``)}
            ${(kpiRole ? `and a.kpi_role ='${kpiRole}'` : ``)}
            )
        -------------------------
        -- lấy danh sách cụ thể
        select * from cur_staff_kpi_Ts`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    // (**) Lấy danh sách kpi của nhân viên đã giao để xác định giao trọng số
    // giao chỉ tiêu
    // đánh giá kết quả thực hiện
    getCurStaffKpi(req, res) {
        let orgId = isNaN(req.paramS.organization_id) ? 0 : req.paramS.organization_id;                 // mã tổ chức
        let periodId = isNaN(req.paramS.period_id) ? 0 : req.paramS.period_id;  // mã chu kỳ
        let departmentId = isNaN(req.paramS.department_id) ? 0 : req.paramS.department_id   // mã bộ phận cần xem
        let staffId = isNaN(req.paramS.staff_id) ? 0 : req.paramS.staff_id   // mã nhân viên cần xem
        db.getRsts(`with 
        -- tổ chức hiện tại
        cur_organization as
            (select max(${orgId}) as id from users limit 1),
        -- giai đoạn hiện tại
        cur_period as
            (select  max(a.id) as id 
            from strategy_period a, cur_organization b 
            where a.organization_id=b.id 
            -- hoặc truy vấn giai đoạn cụ thể truyền vào hoặc đang hoạt động hiện tại
            ${(periodId ? `and a.id=${periodId}` : `and a.status = 1`)}
            ),
        -- danh sách các bộ phận thuộc công ty/Trung tâm
         cur_department as
            (WITH RECURSIVE under_tree AS (
                select a.* from organizations a, cur_organization cur
                where a.id=cur.id
                UNION ALL
                SELECT b.*
                FROM organizations b 
                JOIN under_tree ON b.parent_id = under_tree.id
            ORDER BY order_1, id)
            SELECT * FROM under_tree),
		-- danh sách nhân viên thuộc các bộ phận ở trên
		cur_staff as
			(select b.name department_name, c.name as job_name, a.* from staffs a,  cur_department b, job_roles c
			WHERE a.organization_id = b.id
			and a.job_id = c.id),
		-- lấy ds staff_kpi của giai đoạn hiện tại
		cur_staff_kpi as
            (WITH RECURSIVE under_tree AS 
            (select a.* from staffs_kpi a, cur_staff b, cur_period c
                where a.bsc_id in (23,24,25)
                and a.staff_id = b.id
                -- and period_id = c.id
                UNION ALL
                SELECT b.*
                    FROM staffs_kpi b 
                    JOIN under_tree 
                    ON b.parent_id = under_tree.id
                    and b.status=1 -- chỉ lấy kpi đang hoạt động thôi
                ORDER BY order_1)
            select * from under_tree
            where parent_id is not null
            )
		-- ds kpi của nhân viên đã được giao
		select 
            b.name as staff_name
            , b.department_name
            , b.job_name
            , c.name as job_role_name
            , a.* 
        from cur_staff_kpi a, cur_staff b
            LEFT JOIN job_roles c
            on a.job_role_id = c.id		
		where a.staff_id = b.id
		${(departmentId ? `and a.organization_id =${departmentId}` : ``)}
        ${(staffId ? `and a.staff_id =${staffId}` : ``)}
        order by a.organization_id, a.staff_id, a.job_role_id, a.kpi_role
        `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                console.log("Lỗi getRsts", err);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

}
module.exports = new Handler()