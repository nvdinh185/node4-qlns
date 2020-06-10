"use strict"
/**
 * Bộ xử lý cây kpi
 * 
 * ver 1.0 
 * Created by cuong.dq
 * date: 25/12/2019
 * 
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');


/**
 * Tạo bảng đánh giá cho nhân viên toàn bộ của một công ty theo một chu kỳ
 * 
 * @param {*} reportId 
 * @param {*} organizationId 
 */
const createReportStaffsAll = (reportId, organizationId) => {
    return new Promise(async (resolve) => {
        let rtnFinish = {
            inserted: 0,
            updated: 0,
            failed: 0
        }
        try {
            let results = await db.getRsts(`
            WITH RECURSIVE under_tree AS (
                select a.* from staffs_kpi a
                where a.bsc_id in (23,24,25)
                and a.staff_id in (
                    select  id from staffs 
                    where organization_id in (
                        WITH RECURSIVE under_tree AS
                                (
                                select a.* from organizations a
                                where a.id = ${organizationId}
                                UNION ALL
                                SELECT b.*
                                    FROM organizations b JOIN under_tree
                                    ON b.parent_id = under_tree.id
                                )
                                select id from under_tree
                    )
                )
                UNION ALL
                SELECT b.*
                    FROM staffs_kpi b JOIN under_tree
                     ON b.parent_id = under_tree.id
                     and b.status = 1
                ORDER BY order_1)
                select * from under_tree
            `);
            //lấy mảng gốc cây, thực hiện chèn vào csdl
            for (let idx = 0; idx < results.length; idx++) {
                let el = results[idx];
                el.operator_method = el.parent_id > 0 ? el.operator_method : ''; // chi dong bo la cay
                el.report_id = reportId;
                el.order_1 = idx + 1;
                el.created_time = Date.now();
                // el.signature = JSON.stringify({username: req.user.username, time: Date.now()});
                try {
                    await db.insert(arrObj.convertSqlFromJson('report_staffs_kpi', el, []))
                    rtnFinish.inserted++;
                } catch (e) {
                    // nếu đã tạo trước đó thì thực hiện update lại
                    // console.log('loi insert', e.code);
                    if (e.code === 'SQLITE_CONSTRAINT') {
                        try {
                            await db.update(arrObj.convertSqlFromJson('report_staffs_kpi', el, ['report_id', 'id']))
                            rtnFinish.updated++;
                        } catch (ee) {
                            rtnFinish.failed++;
                        }
                    }
                }
            };

            // đã chạy xong toàn bộ, xem thống kê

        }
        catch (err) {
            console.log('loi select', err);

        }
        finally {
            resolve({
                message: 'finish staffs',
                result: rtnFinish
            })
        }
    })
}

/**
 * Tạo bảng kế hoạch đánh giá kỳ cho tất cả các bộ phận của một công ty
 * @param {*} reportId  -- mã chu kỳ báo cáo
 * @param {*} organizationId -- mã đơn vị cấp công ty
 */
const createReportDepartmentsAll = (reportId, organizationId) => {
    return new Promise(async (resolve) => {

        let rtnFinish = {
            inserted: 0,
            updated: 0,
            failed: 0
        }

        try {
            let results = await db.getRsts(`
            WITH RECURSIVE under_tree AS (
                select a.* from departments_kpi a
                where a.bsc_id in (21,22)
                and a.organization_id in (select  id from organizations where parent_id = ${organizationId})
                UNION ALL
                SELECT b.*
                    FROM departments_kpi b
                     JOIN under_tree
                     ON b.parent_id = under_tree.id
                     and b.status = 1
                ORDER BY order_1)
                select * from under_tree
            `);
            //lấy mảng gốc cây, thực hiện chèn vào csdl
            for (let idx = 0; idx < results.length; idx++) {
                let el = results[idx];
                el.operator_method = el.parent_id > 0 ? el.operator_method : ''; // chi dong bo la cay
                el.report_id = reportId;
                el.order_1 = idx + 1;
                el.created_time = Date.now();
                // el.signature = JSON.stringify({username: '', time: Date.now()});
                try {
                    await db.insert(arrObj.convertSqlFromJson('report_departments_kpi', el, []))
                    rtnFinish.inserted++;
                } catch (e) {
                    // nếu đã tạo trước đó thì thực hiện update lại
                    // console.log('loi insert', e);
                    if (e.code === 'SQLITE_CONSTRAINT') {
                        try {
                            await db.update(arrObj.convertSqlFromJson('report_departments_kpi', el, ['report_id', 'id']))
                            rtnFinish.updated++;
                        } catch (ee) {
                            rtnFinish.failed++;
                        }
                    }
                }
            };
        }
        catch (err) {
            console.log('loi select', err);

        }
        finally {
            resolve({
                message: 'finish departments',
                result: rtnFinish
            })
        }
    })
}

/**
 * Tạo bản đồ kpi cho đơn vị cấp công ty
 * @param {*} reportId 
 * @param {*} organizationId 
 */
const createReportBscAll = (reportId, organizationId) => {
    return new Promise(async (resolve) => {
        let rtnFinish = {
            inserted: 0,
            updated: 0,
            failed: 0
        }
        try {
            let results = await db.getRsts(`
            WITH RECURSIVE under_tree AS (
            select a.* from strategy_map a
            where a.bsc_id in (11,12,13,14)
            and a.organization_id = ${organizationId}
            UNION ALL
            SELECT b.*
                FROM strategy_map b
                 JOIN under_tree
                 ON b.parent_id = under_tree.id
                 and b.status = 1 and b.weight>0
            ORDER BY order_1)
            select * from under_tree
            `);
            //lấy mảng gốc cây, thực hiện chèn vào csdl
            for (let idx = 0; idx < results.length; idx++) {
                let el = results[idx];
                el.operator_method = el.is_leaf === 1 ? el.operator_method : ''; // chi dong bo la cay
                el.report_id = reportId;
                el.order_1 = idx + 1;
                el.created_time = Date.now();
                // el.signature = JSON.stringify({ username: '', time: Date.now() });
                try {
                    await db.insert(arrObj.convertSqlFromJson('report_map_kpi', el, []))
                    rtnFinish.inserted++;
                } catch (e) {
                    // console.log('loi insert', e.code);
                    if (e.code === 'SQLITE_CONSTRAINT') {
                        try {
                            await db.update(arrObj.convertSqlFromJson('report_map_kpi', el, ['report_id', 'id']))
                            rtnFinish.updated++;
                        } catch (ee) {
                            rtnFinish.failed++;
                        }
                    }
                }
            };
        }
        catch (err) {
            console.log('loi select', err);
        }
        finally {
            resolve({
                message: 'finish bscKpis',
                result: rtnFinish
            })
        }
    })
}


class Handler {

    /**
     * Lấy cây phân rã báo cáo dùng để giao kế hoạch 
     * hoặc dùng để đánh giá chỉ tiêu theo cây phân rã này
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getTreeKpiReport(req, res, next) {
        db.getRsts(`
        WITH RECURSIVE
	    --- R bang bao cao cua doanh nghiep
		s_report as 
		(select * from reports r
		where r.organization_id = ${(req.paramS.organization_id ? req.paramS.organization_id : 0)}  -- thuoc danh nghiep nao
		and r.id = ${(req.paramS.report_id ? req.paramS.report_id : 0)}  -- thuoc chu ky bao cao nao
		),
        --- A
        s_map as
        (
        select  
        a.id as map_id
        , a.parent_id as parent_map_id
        , b.name as company_name
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.root_weight_percent
        from strategy_map a
        , organizations b
        where a.organization_id = ${(req.paramS.organization_id ? req.paramS.organization_id : 0)} -- thuộc công ty nào
        ${(req.paramS.kpi_id ? `and a.id = ${req.paramS.kpi_id}` : ``)}  -- thuộc kpi nào
        and a.is_leaf = 1 
        and a.organization_id = b.id
        )
        -- B
        , s_seperated_map as
        (select 
        a.map_id
        , a.id as seperated_map_id
        , a.parent_id as parent_seperated_map_id
        , b.name as department_name
        , a.kpi_role
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.weight as root_weight_percent
        from seperated_map_kpi a
        ,  organizations b
        , s_map c
        where a.map_id is not null 
        and a.organization_id = b.id
        and a.map_id = c.map_id
        )
        -- C
        , s_department as 
        (select 
        a.map_id
        , a.seperated_map_id
        , a.id as department_kpi_id
        , a.parent_id as parent_department_kpi_id
        , a.organization_id
        , b.name as department_name
        , a.kpi_role
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.root_weight_percent
        from departments_kpi a
        , organizations b
        , s_seperated_map c
        where a.seperated_map_id is not NULL
        and a.organization_id = b.id
        and a.seperated_map_id = c.seperated_map_id)
        -- D
        , s_role as
        (
        select 
        d.map_id 
        , d.seperated_map_id 
        , a.department_kpi_id
        , a.id as seperated_role_id
        , a.parent_id as parent_seperated_role_id
        , a.organization_id
        , b.name as department_name
        , a.job_role_id
        , c.name as role_name 
        , a.kpi_role
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.weight as root_weight_percent
        from seperated_roles_kpi a
        , organizations b
        , job_roles c
        , s_department d
        where a.department_kpi_id is not null
        and a.organization_id = b.id 
        and a.job_role_id = c.id
        and a.department_kpi_id = d.department_kpi_id
        )
        -- E
        , s_staff as
        (
        select 
        e.map_id
        , e.seperated_map_id
        , e.department_kpi_id
        , a.seperated_role_id
        , a.id as staff_kpi_id
        , a.parent_id as parent_staff_kpi_id
        , a.organization_id
        , b.name as department_name
        , a.staff_id
        , c.name as staff_name
        , a.job_role_id
        , d.name as job_name
        , a.kpi_role
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.root_weight_percent
        from staffs_kpi a
        , organizations b
        , staffs c
        , job_roles d
        , s_role e
        where a.parent_id is not NULL
        and a.organization_id = b.id
        and a.staff_id = c.id
        and a.job_role_id = d.id
        and a.seperated_role_id = e.seperated_role_id
        )
        -- CAU LENH lay cac truong nhap ke hoach, 
        -- A bang bao cao cua ke hoach bsc kpi
        select  
		a.report_id -- chu ky bao cao 
		, a.id
		, 'report_map_kpi' as table_name
        , a.id as tree_id
        ,  null  as tree_parent_id
        , s_map.company_name as organization_name
        , null as kpi_role
        , a.name
        , a.unit
        , a.calculating_description
        , a.status
        , a.root_weight_percent
        , a.operator_method
        , a.target_description
		, a.target
		, a.target_limit
		, a.result
		, a.result_effective
		, a.total_effective
        from report_map_kpi a
		JOIN s_map, s_report
        on s_map.map_id = a.id
		and s_report.id=a.report_id
        UNION ALL
        -- B bang phan ra cho don vi phong ban
        select  
		null as report_id,
		null as id,
		null as table_name,
        b.map_id || '-' || b.seperated_map_id  as tree_id
        ,  b.map_id as tree_parent_id
        , b.department_name as organization_name
        , b.kpi_role
        , b.kpi_name as name
        , b.unit
        , b.calculating_description
        , b.status
        , b.root_weight_percent
        , null as operator_method
        , null as target_description
		, null as target
		, null as target_limit
		, null as result
		, null as result_effective
		, null as total_effective
        from s_seperated_map b
        JOIN s_map
        on s_map.map_id = b.map_id
        UNION ALL
        -- E -- report departments_kpi 
		select 
		e.report_id,
		e.id,
		'report_departments_kpi' as table_name,
		s_department.map_id || '-' || s_department.seperated_map_id || '-' || s_department.department_kpi_id  as tree_id
        , s_department.map_id || '-' ||s_department.seperated_map_id as tree_parent_id
        , s_department.department_name as organization_name
        , e.kpi_role
        , e.name
        , e.unit
        , e.calculating_description
        , e.status
        , e.root_weight_percent
        , e.operator_method
        , e.target_description
		, e.target
		, e.target_limit
		, e.result
		, e.result_effective
		, e.total_effective
		from report_departments_kpi e
		JOIN s_department, s_report
        on s_department.department_kpi_id = e.id
		and s_report.id=e.report_id
		UNION ALL
		-- D -- bang phan ra cho chuc danh
        select 
		null as report_id,
		null as id,
		null as table_name,
        d.map_id || '-' || d.seperated_map_id || '-' || d.department_kpi_id || '-' || d.seperated_role_id as tree_id
        , d.map_id || '-' || d.seperated_map_id || '-' || d.department_kpi_id  as tree_parent_id
        , d.role_name as organization_name
        , d.kpi_role
        , d.kpi_name as name
        , d.unit
        , d.calculating_description
        , d.status
        , d.root_weight_percent
        , null as operator_method
        , null as target_description
		, null as target
		, null as target_limit
		, null as result
		, null as result_effective
		, null as total_effective
        from s_role d
        JOIN s_department
        on s_department.department_kpi_id = d.department_kpi_id
		UNION ALL
		-- F -- report staffs_kpi
		SELECT
		f.report_id,
		f.id,
		'report_staffs_kpi' as table_name,
        s_staff.map_id || '-' || s_staff.seperated_map_id || '-' || s_staff.department_kpi_id || '-' || s_staff.seperated_role_id || '-' || s_staff.staff_kpi_id as tree_id
        , s_staff.map_id || '-' || s_staff.seperated_map_id || '-' || s_staff.department_kpi_id || '-' || s_staff.seperated_role_id as tree_parent_id
        , s_staff.staff_name as organization_name
        , f.kpi_role
        , f.name
        , f.unit
        , f.calculating_description
        , f.status
        , f.root_weight_percent
        , f.operator_method
        , f.target_description
		, f.target
		, f.target_limit
		, f.result
		, f.result_effective
		, f.total_effective
		from report_staffs_kpi f
		JOIN s_staff, s_report
        on s_staff.staff_kpi_id = f.id
		and s_report.id=f.report_id
        `)
            .then(results => {
                // console.log(results);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });

    }

    /**
     * Lấy cây phân rã kpi từ bản đồ chiến lược xuống đến cá nhân
     * toàn bộ cây của doanh nghiệp 
     * hoặc chỉ 1 kpi lựa chọn
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getTreeKpi(req, res, next) {
        db.getRsts(`
        WITH RECURSIVE
        --- A
        s_map as
        (
        select  
        a.id as map_id
        , a.parent_id as parent_map_id
        , b.name as company_name
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.root_weight_percent
        from strategy_map a
        , organizations b
        where a.organization_id = ${(req.paramS.organization_id ? req.paramS.organization_id : 0)} 
        ${(req.paramS.kpi_id ? `and a.id = ${req.paramS.kpi_id}` : ``)}
        and a.is_leaf = 1 
        and a.organization_id = b.id
        )
        -- B
        , s_seperated_map as
        (select 
        a.map_id
        , a.id as seperated_map_id
        , a.parent_id as parent_seperated_map_id
        , b.name as department_name
        , a.kpi_role
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.weight as root_weight_percent
        from seperated_map_kpi a
        ,  organizations b
        , s_map c
        where a.map_id is not null 
        and a.organization_id = b.id
        and a.map_id = c.map_id
        )
        -- C
        , s_department as 
        (select 
        a.map_id
        , a.seperated_map_id
        , a.id as department_kpi_id
        , a.parent_id as parent_department_kpi_id
        , a.organization_id
        , b.name as department_name
        , a.kpi_role
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.root_weight_percent
        from departments_kpi a
        , organizations b
        , s_seperated_map c
        where a.seperated_map_id is not NULL
        and a.organization_id = b.id
        and a.seperated_map_id = c.seperated_map_id)
        -- D
        , s_role as
        (
        select 
        d.map_id 
        , d.seperated_map_id 
        , a.department_kpi_id
        , a.id as seperated_role_id
        , a.parent_id as parent_seperated_role_id
        , a.organization_id
        , b.name as department_name
        , a.job_role_id
        , c.name as role_name 
        , a.kpi_role
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.weight as root_weight_percent
        from seperated_roles_kpi a
        , organizations b
        , job_roles c
        , s_department d
        where a.department_kpi_id is not null
        and a.organization_id = b.id 
        and a.job_role_id = c.id
        and a.department_kpi_id = d.department_kpi_id
        )
        -- E
        , s_staff as
        (
        select 
        e.map_id
        , e.seperated_map_id
        , e.department_kpi_id
        , a.seperated_role_id
        , a.id as staff_kpi_id
        , a.parent_id as parent_staff_kpi_id
        , a.organization_id
        , b.name as department_name
        , a.staff_id
        , c.name as staff_name
        , a.job_role_id
        , d.name as job_name
        , a.kpi_role
        , a.name as kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.root_weight_percent
        from staffs_kpi a
        , organizations b
        , staffs c
        , job_roles d
        , s_role e
        where a.parent_id is not NULL
        and a.organization_id = b.id
        and a.staff_id = c.id
        and a.job_role_id = d.id
        and a.seperated_role_id = e.seperated_role_id
        )
        -- cau lenh 
        -- A
        select  
        a.map_id as id
        ,  null  as parent_id
        , a.company_name as organization_name
        , null as kpi_role
        , a.kpi_name
        , a.unit
        , a.calculating_description
        , a.status
        , a.root_weight_percent
        from s_map a
        UNION ALL
        -- B 
        select  
        b.map_id || '-' || b.seperated_map_id  as id
        ,  b.map_id as parent_id
        , b.department_name as organization_name
        , b.kpi_role
        , b.kpi_name
        , b.unit
        , b.calculating_description
        , b.status
        , b.root_weight_percent
        from s_seperated_map b
        JOIN s_map
        on s_map.map_id = b.map_id
        UNION ALL
        -- C
        select  
        c.map_id || '-' || c.seperated_map_id || '-' || c.department_kpi_id  as id
        , c.map_id || '-' ||c.seperated_map_id as parent_id
        , c.department_name as organization_name
        , c.kpi_role
        , c.kpi_name
        , c.unit
        , c.calculating_description
        , c.status
        , c.root_weight_percent
        from s_department c
        JOIN s_seperated_map
        on s_seperated_map.seperated_map_id = c.seperated_map_id
        UNION ALL
        -- D
        select 
        d.map_id || '-' || d.seperated_map_id || '-' || d.department_kpi_id || '-' || d.seperated_role_id
        , d.map_id || '-' || d.seperated_map_id || '-' || d.department_kpi_id  as parent_id
        , d.role_name as organization_name
        , d.kpi_role
        , d.kpi_name
        , d.unit
        , d.calculating_description
        , d.status
        , d.root_weight_percent
        from s_role d
        JOIN s_department
        on s_department.department_kpi_id = d.department_kpi_id
        UNION ALL
        -- E
        select 
        e.map_id || '-' || e.seperated_map_id || '-' || e.department_kpi_id || '-' || e.seperated_role_id || '-' || e.staff_kpi_id as id
        , e.map_id || '-' || e.seperated_map_id || '-' || e.department_kpi_id || '-' || e.seperated_role_id as parent_id
        , e.staff_name as organization_name
        , e.kpi_role
        , e.kpi_name
        , e.unit
        , e.calculating_description
        , e.status
        , e.root_weight_percent
        from s_staff e
        JOIN s_role
        on s_role.seperated_role_id = e.seperated_role_id
        `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Thực hiện gọi chức năng tạo kỳ báo cáo cho đơn vị
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createReportAll(req, res, next) {
        // lấy biến truyền lên
        let { organization_id, report_id } = req.paramS;

        // xem trong csdl đã có kỳ báo cáo này hợp lệ không?
        let { reportId, organizationId } = await db.getRst(`
        select id as reportId, organization_id as  organizationId from reports 
        where organization_id=${organization_id}
        and id=${report_id}`);

        let resultCreate = {};

        // kiểm tra hợp lệ đã có kỳ báo cáo trong csdl thì cho
        if (reportId && organizationId) {
            try {
                let resultBsc = await createReportBscAll(reportId, organizationId);
                // console.log('bsc: ', resultBsc);
                resultCreate.bsc_kpi = resultBsc;
                let resultDepartments = await createReportDepartmentsAll(reportId, organizationId);
                // console.log('department: ', resultDepartments);
                resultCreate.departments_kpi = resultDepartments;
                let resultStaffs = await createReportStaffsAll(reportId, organizationId);
                // console.log('staffs: ', resultStaffs);
                resultCreate.staffs_kpi = resultStaffs;
                resultCreate.status = 'OK';
            } catch (e) {
                resultCreate.status = 'NOK';
                resultCreate.message = 'Lỗi tạo kỳ báo cáo';
                resultCreate.error = e;
            }
        } else {
            resultCreate.status = 'NOK';
            resultCreate.message = 'Không có tham số vào';
            resultCreate.paramS = req.paramS;
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(arrObj.getJsonStringify(resultCreate));

    }

    // liet ke bao cao theo don vi
    getReportDepartmentsAll(req, res, next) {
        db.getRsts(`
        select b.name as department_name, a.* from
        (select 
        organization_id
        , count(1) as count_kpi
        , sum(root_weight_percent) as root_weight_percent
        , sum(total_effective) as total_effective
        from report_departments_kpi
        WHERE report_id = ${(req.paramS.report_id ? req.paramS.report_id : 0)}
        and parent_id > 0
        and organization_id in (
        WITH RECURSIVE under_tree AS
            (
            select a.* from organizations a
            where a.id = ${(req.paramS.organization_id ? req.paramS.organization_id : 0)}
            UNION ALL
            SELECT b.*
                FROM organizations b JOIN under_tree
                ON b.parent_id = under_tree.id
            )
            select id from under_tree
        )
        group by organization_id
        ) a
        LEFT JOIN organizations b
        on a.organization_id = b.id
        `)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });

    }

    // liet ke bao cao theo ca nhan
    getReportStaffsAll(req, res, next) {

        let where = ``;

        if (req.paramS.organization_id)
            where = `and a.organization_id in (
                                                WITH RECURSIVE under_tree AS
                                                    (
                                                    select a.* from organizations a
                                                    where a.id = ${req.paramS.organization_id}
                                                    UNION ALL
                                                    SELECT b.*
                                                        FROM organizations b JOIN under_tree
                                                        ON b.parent_id = under_tree.id
                                                    )
                                                    select id from under_tree
                                                )`;
        if (req.paramS.job_roles)
            where = `and a.job_id in (${req.paramS.job_roles.toString()})`;


        db.getRsts(`
        with
        staff as
        (select a.id as staff_id
                , a.job_id
                , a.organization_id as department_id
                , a.name as staff_name
                , b.name as department_name
                , c.name as job_name
                from staffs a
                LEFT JOIN organizations b
                on a.organization_id = b.id
                LEFT JOIN job_roles c
                on a.job_id = c.id
                where a.status=1
				${where}
        )
        , 
        report as
        (select 
                a.organization_id
                , a.staff_id
				, a.report_id
                , count(1) as count_kpi
                , sum(a.root_weight_percent) as root_weight_percent
                , sum(a.total_effective) as total_effective
                from report_staffs_kpi a, staff b
                    WHERE a.report_id =${(req.paramS.report_id || 0)}
                        and a.parent_id>0
                        and a.staff_id = b.staff_id
                group by a.organization_id, a.staff_id, a.report_id
        )
        -- Mệnh đề lấy kết quả ở đây
        select 
		b.report_id
		, c.name as report_name
        , a.*
        , b.organization_id
        , b.count_kpi
        , b.root_weight_percent
        , b.total_effective
        from staff a
        LEFT JOIN report b
        on a.staff_id = b.staff_id
		LEFT JOIN reports c
		on b.report_id = c.id
        ORDER BY department_id, a.job_id, a.staff_id
        `)
            .then(results => {
                // console.log(results);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(arrObj.getJsonStringify(results));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }
}

module.exports = new Handler()

