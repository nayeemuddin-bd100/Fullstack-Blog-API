const fs = require("fs");
const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
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


module.exports = {
	createPostCtrl,
	fetchPostsCtrl,
};
