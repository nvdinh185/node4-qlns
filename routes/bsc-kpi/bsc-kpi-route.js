"use strict"

const router = require('express').Router();

const postHandler = require('../../utils/post-handler');

const handlers = require('../../handlers/bsc-kpi/bsc-kpi-handler');

const adminHandler = require("../../handlers/bsc-kpi/admin-handler");

const parameterHandler = require("../../handlers/bsc-kpi/parameters-handler");

const fileHandler = require('../../handlers/bsc-kpi/file-handler');

router.get('/get-user-report'
    , handlers.getUserReport
);

router.get('/get-organizations'
    , adminHandler.getOrganizations
);

router.post('/post-parameters'
    , postHandler.jsonProcess //lay json_data
    //thực hiện chèn và sửa thông tin
    , parameterHandler.postTable
);

router.get('/get-job-roles'
    , handlers.getJobRoles
);

router.get('/get-staffs'
    , handlers.getStaffs
);


router.get('/get-templates/*'
    , fileHandler.getTemplates       // dựa vào giá trị req.user.username trả thông tin user
)

module.exports = router;