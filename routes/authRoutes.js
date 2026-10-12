const express = require('express');
const cors = require('cors');
const router = express.Router();
const cookie_parser = require('cookie-parser');
require('dotenv').config();
const auth_controllers = require('../controllers/auth_controllers.js');

router.use(auth_controllers);
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended : true }));
router.use(cookie_parser());

module.exports = {
    router
};