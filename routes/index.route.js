const express = require('express');
const router = express.Router();
const authroute = require('./auth.route');
const dashboardroute = require('./dashboard.route');

router.use(authroute);
router.use(dashboardroute);

module.exports = router;