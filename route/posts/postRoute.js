const express = require("express");
const {
	createPostCtrl,
	fetchPostsCtrl,
	fetchSinglePostCtrl,
} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {  photoUpload, postsImgResize } = require("../../middlewares/uploads/photoUpload");


const postRoute = express.Router()

postRoute.post('/', authMiddleware, photoUpload, postsImgResize, createPostCtrl)

// Get All Post
postRoute.get("/", authMiddleware, fetchPostsCtrl); //api/posts

// Get single Post
postRoute.get("/:postId", authMiddleware, fetchSinglePostCtrl);

module.exports = postRoute;