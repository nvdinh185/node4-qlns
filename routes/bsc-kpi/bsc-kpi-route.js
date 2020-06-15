"use strict"

const router = require('express').Router();

const postHandler = require('../../utils/post-handler');

const handlers = require('../../handlers/bsc-kpi/bsc-kpi-handler');

const adminHandler = require("../../handlers/bsc-kpi/admin-handler");

const parameterHandler = require("../../handlers/bsc-kpi/parameters-handler");

router.get('/get-user-report'
    , handlers.getUserReport
);

router.get('/get-organizations'
    , adminHandler.getOrganizations
);

router.post('/post-parameters'
    , postHandler.jsonProcess //lay json_data
    // , tokenHandler.getToken //req.token
    // , tokenHandler.verifyProxyToken //req.user
    //chèn yêu cầu phân quyền để thực hiện việc này
    // , adminHandler.setFunctionFromPath //thiet lap chuc nang tu pathName
    // , adminHandler.checkFunctionRole   //kiem tra quyen co khong de cho phep
    //chèn các biến đổi dữ liệu cần thiết (nếu có) tùy vào tham số
    //thực hiện chèn và sửa thông tin
    , parameterHandler.postTable
);

module.exports = router;