const express = require('express');
const {
	createCommentCtrl,
	fetchAllCommentCtrl,
	fetchSingleCommentCtrl,
	updateCommentCtrl,
	deleteCommentCtrl
} = require("../../controllers/comments/commentCtrl");
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const commentRoute = express.Router()

// create comment
commentRoute.post('/',authMiddleware,createCommentCtrl)

//fetch all comments
commentRoute.get('/', authMiddleware, fetchAllCommentCtrl)

//fetch single comments
commentRoute.get("/:commentId", authMiddleware, fetchSingleCommentCtrl);

//update comments
commentRoute.put("/:commentId", authMiddleware, updateCommentCtrl);

//delete comments
commentRoute.delete("/:commentId", authMiddleware, deleteCommentCtrl);


module.exports = commentRoute