const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");
const Post = require("../../model/post/Post");
const validateMongoDbId = require("../../utils/validateMongoDbId");


/*=============================================
=              Create Comment API          =
=============================================*/
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
	const { user } = req.headers;
	const { description, postId } = req?.body;

	try {
		const comment = await Comment.create({
			post:postId,
			author: user,
			description,
		})
		await comment.save()
		
		const post = await Post.findById(postId);
		post.comments.push(comment._id);
		await post.save();

		res.json(comment);
	} catch (error) {
		res.json(error);
	}
});


/*=============================================
=              Fetch all comment         =
=============================================*/

const fetchAllCommentCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const comments = await Comment.find({}).sort({ createdAt: -1 });
		res.json(comments)
	} catch (error) {
		res.json(error)
	}
})

/*=============================================
=              Fetch single comment         =
=============================================*/
const fetchSingleCommentCtrl = expressAsyncHandler(async(req, res) => {
	const { commentId } = req?.params
	
	try {
		const comment = await Comment.findById(commentId)
		res.json(comment)
	} catch (error) {
		res.json(error)
	}
})


/*=============================================
=             update comment         =
=============================================*/
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
	const { commentId } = req?.params;
	const { user } = req.headers;
	const { description, postId } = req?.body;

	validateMongoDbId(user._id)

	try {

		const comment = await Comment.findByIdAndUpdate(commentId, {
			post: postId,
			author: user,
			description,
		},{new:true,runValidators:true});

	
		res.json(comment);
	} catch (error) {
		res.json(error);
	}
	
});
/*=============================================
=              Delete comment         =
=============================================*/
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
	const { commentId } = req?.params;

	try {
		const comment = await Comment.findByIdAndDelete(commentId)
		res.json(comment);
	} catch (error) {
		res.json(error)
	}


});


module.exports = {
	createCommentCtrl,
	fetchAllCommentCtrl,
	fetchSingleCommentCtrl,
	updateCommentCtrl,
	deleteCommentCtrl,
};
