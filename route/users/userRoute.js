const express = require('express');
const { userRegisterCtrl, userLoginCtrl } = require('../../controllers/users/usersCtr');
const userRoutes = express.Router();




userRoutes.post('/register', userRegisterCtrl)
userRoutes.post('/login', userLoginCtrl)



module.exports = userRoutes;