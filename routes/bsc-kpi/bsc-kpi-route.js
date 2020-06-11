"use strict"

const router = require('express').Router();

const handlers = require('../../handlers/bsc-kpi/bsc-kpi-handler');

const adminHandler = require("../../handlers/bsc-kpi/admin-handler");

router.get('/get-user-report'
    , handlers.getUserReport
);

router.get('/get-organizations'
    , adminHandler.getOrganizations
);


module.exports = router;