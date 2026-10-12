const express = require('express');
const router = express.Router();
const cookie_parser = require('cookie-parser');
require('dotenv').config();
const app_Controllers = require('../controllers/app_controllers.js');

router.use(app_Controllers);
router.use(express.json());
router.use(express.urlencoded({ extended : true }));
router.use(cookie_parser());

module.exports = router;
