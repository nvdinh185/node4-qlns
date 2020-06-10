"use strict"

const router = require('express').Router();

const tokenHandler = require('../../handlers/admin/token-forward');
const handlers = require('../../handlers/bsc-kpi/bsc-kpi-handler');

const adminHandler = require("../../handlers/bsc-kpi/admin-handler");

router.get('/get-user-report'
    // , tokenHandler.getToken
    // , tokenHandler.verifyProxyToken
    , handlers.getUserReport
);

router.get('/get-organizations'
    // , tokenHandler.getToken
    // , tokenHandler.verifyProxyToken
    , adminHandler.getOrganizations
);


module.exports = router;