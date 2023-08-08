const fs = require("fs");
const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const cloudinaryUpload = require("../../utils/cloudinary");
const validateMongoDbId = require("../../utils/validateMongoDbId");



/*=============================================
=              Create Post API          =
=============================================*/
const createPostCtrl = expressAsyncHandler(async (req, res) => {
	const { filename } = req.file;
	const localPath = `public/images/posts/${filename}`;
	const imgUpload = await cloudinaryUpload(localPath);

	const { _id } = req.headers.user;
	validateMongoDbId(_id);
	
	try {
		const post = await Post.create({
			...req.body,
			author: _id,
			image: imgUpload,
		});

		// save post id in user details
		await User.findByIdAndUpdate(
			_id,
			{ $push: { posts: post._id } },
			{ new: true }
		);

		res.json(post);
		
		// Delete the temporarily saved image file from the server after uploading it to Cloudinary
		fs.unlinkSync(localPath);
	} catch (error) {
		res.json(error);
	}
});


/*=============================================
=           Fetch All Post            =
=============================================*/

const fetchPostsCtrl = expressAsyncHandler(async(req, res) => {
	try {
		const post = await Post.find({}).populate("author");
		res.json(post);
	} catch (error) {
		res.json(error);
	}

})

/*=============================================
=           Fetch Single Post            =
=============================================*/
const fetchSinglePostCtrl = expressAsyncHandler(async (req, res) => {
	const postId = req.params.postId
	validateMongoDbId(postId)
	try {
		const post = await Post.findById(postId).populate("author");

		// Update number of views

		await Post.findByIdAndUpdate(
			postId, 
			{ $inc: { numViews: 1 } },
			{new:true}
		)
		// post.numViews = post.numViews + 1;
		// await post.save()
		res.json(post)
		
	} catch (error) {
		res.json(error);
	}
})
module.exports = {
	createPostCtrl,
	fetchPostsCtrl,
	fetchSinglePostCtrl,
};
