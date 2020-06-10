"use strict"
/**
 * ver 3.2
 * Cho phép cập nhập tổ chức cấp root và danh sách tổ chức cấp 1,2
 * Phân quyền tổ chức: organization_id, organization_list
 * Phân quyền nếu status bị khóa thì không trả quyền
 * 
 * 
 * ver 3.1 -- debug change_time
 * Đổi tên trường trong bảng users
 * 
 * image--> avatar
 * change_time --> updated_time
 * 
 * 
 * ver 2.0
 * Lấy luôn địa chỉ email trong req.user.email (nếu có)
 * 
 * su dung de kiem tra quyen truy cap
 * phan quyen user
 * bien dau vao la req.user
 * xu ly tu token truoc do, neu req.user.role===99?"" 
 * la quyen root (chi developer 903500888 thoi)
 */
const arrObj = require('../../utils/array-object');
const db = require('../../db/sqlite3/db-pool');

//danh sách menu cơ bản khi user chưa được phân quyền
const basicMenu = [1, 2, 3, 5, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 32]; //menu cơ bản khi chưa phân quyền
const basicFunctions = [1];    //chức năng cơ bản khi chưa phân quyền
const organizationDefault = 1;    //Đơn vị của user tự gán cố định là demo

class Handler {

    /**
     * Thủ tục này lấy nội dung req.json_data.params.content
     * và req.user 
     * để phân tích lấy địa chỉ email, lấy user và chèn user cho bảng user
     * kết quả trả về là trạng thái đang chờ xét duyệt trong vòng 24h
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async postNewsWelcome(req, res, next) {
        try {
            // console.log('Json data',req.user)

            if (req.json_data
                && req.user
                && req.user.username
                && req.user.data
            ) {

                let emails = arrObj.getEmailFromText(req.user.data.email);
                let emailMobifone = emails.find(x => x.lastIndexOf("@mobifone.vn"));

                let row = await db.getRst(`select *
                                            from users
                                            where username='${req.user.username}'`);
                if (emailMobifone) {
                    emailMobifone = emailMobifone.toLowerCase();
                    if (!row) {
                        row = await db.getRst(`select *
                                                from users
                                                where email like '%${emailMobifone}%'`);
                    }
                    if (row && row.id) {
                        if (("" + row.id) === row.username) {//trường hợp username giả lập theo id
                            let jsonUpdate = {
                                username: req.user.username
                                , fullname: row.fullname || req.user.data.fullname
                                , nickname: row.nickname || req.user.data.nickname
                                , avatar: row.avatar || req.user.data.avatar
                                , background: row.background || req.user.data.background
                                , phone: row.phone || req.user.data.phone || '0' + req.user.data.username
                                , email: row.email || (emails.length > 0 ? emails.toString() : req.user.data.email)
                                , role: row.role || req.user.data.role || 0
                                , status: row.status || (req.user.data.role === 99 ? 1 : 1)
                                , start_time: Date.now()
                                , updated_time: Date.now()
                                , login_time: Date.now()
                                , id: row.id
                            }
                            await db.runSql(db.convertSqlFromJson('users', jsonUpdate, ['id']))
                            // console.log(u);

                        }
                    }
                }
                //trường hợp này chưa có user trong bảngs
                let jsonInsert = {
                    username: req.user.username
                    , organization_id: organizationDefault
                    , fullname: req.user.data.fullname
                    , nickname: req.user.data.nickname
                    , avatar: req.user.data.avatar
                    , background: req.user.data.background
                    , phone: req.user.data.phone || '0' + req.user.data.username
                    , email: (emails.length > 0 ? emails.toString() : req.user.data.email)
                    , role: req.user.data.role || 0
                    , start_time: Date.now()
                    , updated_time: Date.now()
                    , login_time: Date.now()
                    , status: (req.user.data.role === 99 ? 1 : 1)
                }
                await db.insert(db.convertSqlFromJson("users", jsonInsert, []))
                // console.log('i', i);
            }
        } catch (e) {
            console.log('Lỗi toàn cục postNewWelcome', e)
        }
        //chuyển next bước tiếp theo để kiểm tra user trong bảng cùng trạng thái của nó
        next();
    }


    /**
     * Thiết lập chức năng dựa trên đường dẫn của get/post
     * Đường dẫn cuối sẽ là duy nhất của từng chức năng
     * ví dụ: /db/edit-customer thì edit-customer là chức năng
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    setFunctionFromPath(req, res, next) {
        //gán đường dẫn phía sau cùng để gán chức năng cho nó
        req.functionCode = req.pathName.substring(req.pathName.lastIndexOf("/") + 1);
        next();
    }

    /**
     * req.functionCode = "active" //chuc nang toi thieu la active 
     * 
     * req.functionCode = "edit-customer" //yeu cau kiem tra quyen
     * //neu khong co functionCode thi xem nhu khong can kiem tra quyen
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async checkFunctionRole(req, res, next) {
        // dữ liệu data này nằm ở bảng admin_users
        // console.log(req.functionCode);

        if (req.functionCode) { //can kiem tra quyen cua user co khong
            if (req.user && req.user.data) {
                if (req.user.data.role === 99) {
                    next() //quyen root
                } else {
                    try {
                        let row = await db.getRst(`select b.roles from users a, admin_roles b
                                                    where a.id = b.user_id
                                                    and a.status = 1
                                                    and a.username='${req.user.username}'`);

                        // console.log('row:', row);


                        let row2 = await db.getRst(`select id
                                                    from admin_functions
                                                    where function_code ='${req.functionCode}'`);

                        // console.log('row2:', row2, req.functionCode);       

                        let roles = row && row.roles ? JSON.parse(row.roles) : undefined; //tra ve object
                        let functionId = row2 ? row2.id : undefined; //tra ve id
                        //console.log('rolesFunction', functionId, roles);
                        let index = roles && functionId && roles.functions ? roles.functions.findIndex(x => x === functionId) : -1;

                        if (index >= 0) {
                            next()
                        } else {
                            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify({ message: 'Bạn KHÔNG ĐƯỢC PHÂN QUYỀN thực hiện chức năng này' }));
                        }

                    } catch (e) {
                        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({ message: 'Lỗi trong lúc kiểm tra quyền', error: e }));
                    }
                }
            } else {
                res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'Bạn không có quyền thực hiện chức năng này' }));
            }
        } else {
            next(); //xem nhu khong can kiem tra quyen
        }

    }


    /**
     * Truy vấn bảng user nếu không có thì trả về 
     * trạng thái yêu cầu nhập tin lời chào truy cập hệ thống
     * Nếu user đã có thì update thời gian truy cập, 
     * và dựa vào trạng thái để yêu cầu người dùng đợi xác nhận
     * hoặc trả đến bước nhận menu
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * status = 
     * -2 chưa đăng ký sử dụng
     * -1 lỗi hệ thống
     * 0 user bị khóa
     * 1 user đang hoạt động --> req.userRoles.menu --> next
     * 2 user đang chờ xét duyệt trong 24h
     */
    async checkPrivilege(req, res, next) {
        //console.log('user',req.user);
        try {
            let user = await db.getRst("select * from users where username = '" + (req.user ? req.user.username : "") + "'");
            //console.log('buoc 1');
            if (user && user.id) { //user đã được khai báo
                await db.runSql("update users set login_time = " + Date.now() + "\
                            where id="+ user.id);
                //console.log('buoc 2');
                if (user.status === 1) { //nếu user đã tồn tại và đang hoạt động
                    //console.log('buoc 3');
                    let row = await db.getRst("select roles from admin_roles where user_id = '" + user.id + "'");
                    //console.log('buoc 4',row);
                    if (row && row.roles) { //đã được phân quyền trong bảng roles
                        req.userRoles = JSON.parse(row.roles); //'{"menu":[1,2],"functions":[1,2,3,4]} sẽ cho quyền của user này làm được gì
                    }
                    next(); //chuyển sang bước tiếp theo để lấy menu
                } else {//user đã tồn tại nhưng trạng thái của nó là đang bị khóa, hoặc chờ xác nhận thì trả kết quả cho người dùng
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({
                        status: user.status === 2 ? 2 : 0,
                        message: "User của bạn " + (user.status === 2 ? "đang chờ xét duyệt. Vui lòng đợi trong 24h" : "đã bị khóa. Liên hệ quản trị hệ thống để khôi phục")
                    }));
                }
            } else { //user không tồn tại trong bảng users
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    status: -2,
                    message: "User của bạn chưa được đăng ký hệ thống này. Vui lòng xác nhận đăng ký để được phục vụ!"
                }));
            }
        } catch (e) {
            //console.log("Loi kiem tra quyen", e);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                status: -1,
                message: "Có lỗi khi kiểm tra quyền",
                error: e
            }));
        }

    }

    /**
     * Phân quyền user để lấy menu
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getUserMenu(req, res, next) {
        //sau khi đã có req.userRoles.menu
        //console.log('role cua user',req.userRoles);
        //Nếu user có vai trò là 99 (admin toàn quyền thì lấy hết menu)
        //nếu user có voi trò khác thì dựa vào phân quyền sẽ lấy menu cho phép thôi
        //nếu user chưa được cấp phép menu thì sẽ cho phép danh sách menu cơ bản thôi
        db.getRsts(`select * from admin_menu
                    where status = 1 `
            + (req.user && req.user.data && req.user.data.role === 99 ? ""
                : " and id in (" + (req.userRoles && req.userRoles.menu ? req.userRoles.menu.toString() : basicMenu.toString()) + ")")
            + ` order by order_1`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }, 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy danh mục tổ chức cây tổ chức đã khai báo cho hệ thống này
     * Chỉ trả về tổ chức mà user đó đang sở hữu, cùng với tổ chức demo thôi
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getOrganizations(req, res, next) {
        db.getRsts(`select * from organizations
                    where status = 1
                    `+ (req.user && req.user.data && req.user.data.role === 99 ? `` : `
                    and id in (
                                WITH RECURSIVE under_tree AS(
                                    select a.* from organizations a
                            where status = 1
                            and a.id in (1,
                                    (select organization_id from users where username = '`+ (req.user ? req.user.username : '') + `')
                            )
                            UNION ALL
                            SELECT b.*
                                FROM organizations b JOIN under_tree
                            ON b.parent_id = under_tree.id and b.status = 1
                            ORDER BY order_1)
                            select id from under_tree  
                    )
                        `) + `
                        order by order_1`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }, 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Thực hiện chuyển trả organizationId cho phiên sau của chính tổ chức mà user trực thuộc
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getUserOrganizationId(req, res, next) {
        db.getRst(`select * from users
                   where username = '${(req.user ? req.user.username : "")}'`)
            .then(row => {
                req.organizationId = row.organization_id;
                next();
            })
            .catch(err => {
                next();
            })
    }

    /**
     * Lấy danh mục tổ chức của chính user thôi
     * req.organizationId
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getUserOrganizations(req, res, next) {
        db.getRsts(
            `WITH RECURSIVE under_tree AS(
                                select a.* from organizations a
                where status = 1
                and a.id = `+ (req.organizationId ? req.organizationId : 0) + `
                UNION ALL
                SELECT b.*
                            FROM organizations b JOIN under_tree
                    ON b.parent_id = under_tree.id and b.status = 1
                    ORDER BY order_1)
                            select * from under_tree`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }, 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy danh sách user và quyền được phân cho nó
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getUsers(req, res, next) {
        db.getRsts(`select c.name as organization_name, a.*, b.roles from
                                (
                                    select *
                                    from users
                                        `+ (req.user && req.user && req.user.role === 99 ?
                ``
                : ` where organization_id in (1, (select organization_id from users where username = '` + req.user.username + `'))`
            ) + `
            ) a
                            LEFT JOIN admin_roles b
                            ON a.id = b.user_id
                            LEFT JOIN organizations c
                            ON a.organization_id = c.id
                            order by a.status desc, a.updated_time desc`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined }
                        if ((key === "roles" || key === "organization_list" || key === "staff_list" || key === "signature") && value !== null && value.length > 0) { return JSON.parse(value) }
                        return value;
                    }, 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }
    /**
     * Lấy các bảng dữ liệu để tạo bảng trong device client
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getTables(req, res, next) {
        db.getRsts("select *\
                    from tables")
            .then(results => {
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


    getMenus(req, res, next) {
        db.getRsts(`select *
                    from admin_menu
                     where status = 1
                     order by order_1`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }, 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    getFunctions(req, res, next) {
        db.getRsts(`select *
                    from admin_functions
                     where status = 1
                     order by order_1`)
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }, 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            });
    }

    /**
     * Lấy quyền theo token của bạn
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getYourRoles(req, res, next) {
        if (req.user && req.user) {
            try {
                let yourRoles = [];

                let adminFunctions = await db.getRsts("select * from admin_functions where status=1");

                //nếu voi trò chính là 99 (admin/root) thì lấy toàn quyền
                if (req.user.role === 99) {
                    yourRoles = adminFunctions;
                } else {
                    let row = await db.getRst(`select b.roles from users a, admin_roles b 
                                                        where a.id = b.user_id
                                                        and a.status = 1
                                                        and a.username='${req.user.username}'`);

                    //nếu đã có phân quyền rồi
                    let rowRoles = row && row.roles ? JSON.parse(row.roles) : undefined; //tra ve object

                    //có quyền được phân
                    if (rowRoles && rowRoles.functions && rowRoles.functions.length > 0) {
                        rowRoles.functions.forEach(el => {
                            //tìm chức năng được phân quyền
                            let yourFunction = adminFunctions.find(x => x.id === el);
                            if (yourFunction) { //nếu tìm thấy thì bổ sung quyền cho bạn
                                yourRoles.push(yourFunction);
                            }
                        });
                    } else {
                        basicFunctions.forEach(el => {
                            //tìm chức năng được phân quyền
                            let yourFunction = adminFunctions.find(x => x.id === el);
                            if (yourFunction) { //nếu tìm thấy thì bổ sung quyền cho bạn
                                yourRoles.push(yourFunction);
                            }
                        });
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(yourRoles //tra tập quyền được phân cho người dùng
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value;
                    }
                ));

            } catch (e) {
                res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: "Lỗi truy cập db", error: e }));
            }
        } else {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: "Bạn không có quyền vào đây", error: "Lỗi hacking" }));
        }
    }

    /**
     * Sửa thông tin user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async editUser(req, res, next) {

        let dataJson = req.json_data;

        // không cho phép chính user đi phân quyền cho mình
        // điều này sẽ cấm lạm quyền nhé, phải có kiểm soát chéo
        // truyền lên là id của user 
        let userDb = await db.getRst(`select * from users a where a.id = '` + dataJson.id + `'`);

        // tự phân quyền cho mình mở ra
        if (!userDb || !req.user || !req.user 
            // không cho tự thay đổi quyền của mình
            // || (userDb.username === req.user.username && req.user.role !== 99)
        ) {
            //console.log('Bạn không thể tự thay đổi quyền của mình');
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: "Bạn không thể tự thay đổi quyền của mình", error: 'Not allow change yourself!', data: userDb }));
        } else {

            //Lấy 2 vai trò là menu và functions bên trong
            //để cập nhập hoặc chèn vào bảng role
            let roles = {};
            if (dataJson["menu"]) {
                let menu = dataJson["menu"];
                //chuyển đổi dạng số trước khi cập nhập để đồng nhất kiểu số
                menu = menu.map(function (item) { return parseInt(item); });
                arrObj.createObjectKey(roles, "menu", menu);
                delete dataJson["menu"]; //xóa đi để cập nhập bảng user
            }
            if (dataJson["functions"]) {
                let functions = dataJson["functions"]; //chuyển đổi dạng số trước khi cập nhập để đồng nhất kiểu số
                functions = functions.map(function (item) { return parseInt(item); });
                arrObj.createObjectKey(roles, "functions", functions);
                delete dataJson["functions"]; //xóa đi để cập nhập bảng user

            }

            if (Object.keys(roles).length >= 2) {
                //đã phân quyền đầy đủ chức năng và menu
                //thực hiện ghi vào bảng roles
                //console.log(roles,dataJson);
                let row = await db.getRst(`select user_id
                                            from admin_roles
                                            where user_id=${dataJson.id}`);
                if (row && row.user_id) {
                    await db.update(arrObj.convertSqlFromJson("admin_roles",
                        {
                            user_id: dataJson.id,
                            roles: JSON.stringify(roles),
                            updated_time: Date.now(),
                            signature: JSON.stringify({ username: req.user.username, data: roles, time: Date.now() })
                        }, ["user_id"]));
                } else {
                    try {
                        await db.insert(arrObj.convertSqlFromJson("admin_roles", {
                            user_id: dataJson.id,
                            roles: JSON.stringify(roles),
                            created_time: Date.now(),
                            updated_time: Date.now(),
                            signature: JSON.stringify({ username: req.user.username, data: roles, time: Date.now() })
                        }, []));
                    } catch (e) { }
                }

            }

            if (dataJson["organization_id"]) {
                dataJson["organization_id"] = parseInt(dataJson["organization_id"]);
            }

            if (dataJson["organization_list"]) {
                dataJson["organization_list"] = dataJson["organization_list"].map(function (item) { return parseInt(item); });
                //chuyen doi kieu json moi luu duoc
                dataJson["organization_list"] = JSON.stringify(dataJson["organization_list"]);
            }

            if (dataJson["staff_id"]) {
                dataJson["staff_id"] = parseInt(dataJson["staff_id"]);
            }

            if (dataJson["staff_list"]) {
                dataJson["staff_list"] = dataJson["staff_list"].map(function (item) { return parseInt(item); });
                //chuyen doi kieu json moi luu duoc
                dataJson["staff_list"] = JSON.stringify(dataJson["staff_list"]);
            }


            dataJson.updated_time = Date.now();
            dataJson.signature = JSON.stringify({ username: req.user.username, data: req.json_data, time: dataJson.updated_time });
            let jsonUpdate = arrObj.convertSqlFromJson("users", dataJson, ["id"]);

            //console.log('du lieu chuyen len update',jsonUpdate);

            db.update(jsonUpdate)
                .then(data => {
                    let sqlSelect = "select a.*, b.roles\
                                    from users a\
                                    LEFT JOIN admin_roles b\
                                    ON a.id = b.user_id\
                                    where a.id = '"+ dataJson.id + "'";
                    db.getRst(sqlSelect)
                        .then(result => {
                            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify(result
                                , (key, value) => {
                                    if (value === null) { return undefined }
                                    if ((key === "roles" || key === "organization_list" || key === "staff_list" || key === "signature") && value !== null && value.length > 0) { return JSON.parse(value) }
                                    return value;
                                }, 2
                            ));
                        })
                        .catch(err => {
                            console.log('Loi select', err);
                            res.writeHead(435, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify({ message: "Lỗi select CSDL", error: err }));
                        })
                    //trả lại user đã được chỉnh sửa
                })
                .catch(err => {
                    console.log('Loi update', err);
                    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ message: "Lỗi cập nhật CSDL", error: err }));
                })
        }

    }


    /**
     * Dịch vụ trả đường dẫn dịch vụ cho client
     * Máy chủ sẽ mã hóa chuỗi này và ký xác nhận nó 
     * Client dựa vào chữ ký để xác thực là đường dẫn đúng
     * và thực hiện liên lạc với đường dẫn này
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getServiceUrls(req, res, next) {

        let serviceUrls = {}
        /* {
            chatServer: 'https://c3.mobifone.vn',                   // socketIO
            publicServer: 'https://c3.mobifone.vn/api/ext-public',  // public service
            locationServer: 'https://c3.mobifone.vn/api/location',  // location service
            mediaServer: 'https://c3.mobifone.vn/media/db',         // lưu trữ ảnh, file video, tài liệu
            
            adminServer: 'https://c3.mobifone.vn/bsc-kpi/admin',       // api xác thực user, pass và token, api
            resourceServer: 'http://localhost:8080/bsc-kpi/db',     // lưu trữ dữ liệu của phần mềm BSC KPI
            newsServer: 'http://localhost:8080/bsc-kpi/news'        // lưu trữ dữ liệu của phần tin tức
        };

        console.log(JSON.stringify(serviceUrls,null,2)); */

        db.getRst(`select service_urls
                            from organizations
                            where id in (
                                select organization_id from users
                            where username = '`+ (req.user ? req.user.username : '') + `'
                   )
                            `)
            .then(data => {

                if (data && data.service_urls) {
                    try {
                        serviceUrls = JSON.parse(data.service_urls);
                    } catch (e) {
                        serviceUrls = {};
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(serviceUrls
                    , (key, value) => {
                        if (value === null) { return undefined }
                        return value;
                    }, 2
                ));
            })
            .catch(err => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(serviceUrls
                    , (key, value) => {
                        if (value === null) { return undefined }
                        return value;
                    }, 2
                ));
            });
    }

    // lấy thông tin user
    // ưu tiên lấy user của tham số gửi vào
    // nếu không có thì lấy user của token
    getUserInfo(req, res, next) {
        let sqlWhere = req.paramS.id ? `where id = '${req.paramS.id}'` : `where username = '${(req.user ? req.user.username : ``)}'`
        db.getRst(`select * from users ${sqlWhere} `)
            .then(result => {
                // console.log('result: ', result);
                if (result && result.status === 0) {
                    res.status(401).json({
                        message: 'User đã bị khóa, vui lòng liên hệ Quản trị hệ thống'
                    })
                    // res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
                    // res.end(arrObj.getJsonStringify({ status: 'NOK', message: 'User đã bị khóa, vui lòng liên hệ Quản trị hệ thống' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(arrObj.getJsonStringify({ status: 'OK', message: 'Login thành công', data: result }));
                }

            })
            .catch(err => {
                console.log('Lỗi: ', err);
                res.status(401).json({
                    message: 'Lỗi truy vấn csdl admin_users'
                })
            });
    }


}

module.exports = new Handler();