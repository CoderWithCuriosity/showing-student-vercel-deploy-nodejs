const express = require('express');
const router = express.Router();
const {dashboard} = require('../controllers/dashboard.controller');

router.post('/dashboard', dashboard);

module.exports = router;