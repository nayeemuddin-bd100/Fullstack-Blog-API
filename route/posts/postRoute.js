const express = require("express");
const {
	createPostCtrl,
	fetchPostsCtrl,
	fetchSinglePostCtrl,
	updatePostCtrl,
	deletePostCtrl,
} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {  photoUpload, postsImgResize } = require("../../middlewares/uploads/photoUpload");


const postRoute = express.Router()

postRoute.post('/', authMiddleware, photoUpload, postsImgResize, createPostCtrl)

// Get All Post
postRoute.get("/", authMiddleware, fetchPostsCtrl); //api/posts

// Get single Post
postRoute.get("/:postId", fetchSinglePostCtrl);

// Update Post
postRoute.put("/:postId", authMiddleware, updatePostCtrl);

// Delete Post
postRoute.delete("/:postId", authMiddleware, deletePostCtrl);

module.exports = postRoute;