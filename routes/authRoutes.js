const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController.js');
const loginLimiter = require('../Middleware/loginLimiter.js');

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

module.exports = router;