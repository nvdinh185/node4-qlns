"use strict"

const router = require('express').Router();

const postHandler = require('../utils/post-handler');

const handlers = require('../handlers/qlns/qlns-handler');

const parameterHandler = require("../handlers/qlns/parameters-handler");

const fileHandler = require('../handlers/qlns/file-handler');

router.get('/get-user-report'
    , handlers.getUserReport
);

router.get('/get-organizations'
    , handlers.getOrganizations
);

router.post('/post-parameters'
    , postHandler.jsonProcess //lay json_data
    , parameterHandler.postTable
);

router.get('/get-job-roles'
    , handlers.getJobRoles
);

router.get('/get-staffs'
    , handlers.getStaffs
);

router.get('/get-templates/*'
    , fileHandler.getTemplates
)

router.post('/post-organizations'
    , postHandler.jsonProcess //lay json_data
    , handlers.postOrganizations
);

router.post('/post-job-roles'
    , postHandler.jsonProcess //lay json_data
    , handlers.postJobRoles
);

router.post('/post-staffs'
    , postHandler.jsonProcess //lay json_data
    , handlers.postStaffs
);

module.exports = router;