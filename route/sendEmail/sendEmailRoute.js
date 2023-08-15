const express = require('express');
const { sendEmailCtrl } = require('../../controllers/sendEmail/sendEmailCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const sendEmailRoute = express.Router()

sendEmailRoute.post('/',authMiddleware,sendEmailCtrl)

module.exports = sendEmailRoute