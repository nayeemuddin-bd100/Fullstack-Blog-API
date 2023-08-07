const express = require("express");
const { createPostCtrl } = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {  photoUpload, postsImgResize } = require("../../middlewares/uploads/photoUpload");


const postRoute = express.Router()

postRoute.post('/', authMiddleware, photoUpload, postsImgResize, createPostCtrl)

module.exports = postRoute;