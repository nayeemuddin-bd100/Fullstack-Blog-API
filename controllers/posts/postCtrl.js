const fs = require("fs");
const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const cloudinaryUpload = require("../../utils/cloudinary");
const validateMongoDbId = require("../../utils/validateMongoDbId");
const Category = require("../../model/category/Category");

/*=============================================
=              Create Post API          =
=============================================*/
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  let filename;
  let localPath;
  let imgUpload;
  if (req.file) {
    filename = req?.file?.filename;
    localPath = `public/images/posts/${filename}`;
    imgUpload = await cloudinaryUpload(localPath);
  }

  const { _id } = req.headers.user;
  validateMongoDbId(_id);

  try {
    // Find the category by its title
    const category = await Category.findOne({ title: req.body.category });
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

    // Increment the postCount of the corresponding category
    await Category.findByIdAndUpdate(
      category._id,
      { $inc: { postCount: 1 } },
      { new: true }
    );

    res.json(post);

    // Delete the temporarily saved image file from the server after uploading it to Cloudinary
    fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});


const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  const category = req?.query?.category;
  const {
    page = 1,
    limit = 5,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // ?page=2&limit=20&sortBy=title&sortOrder=asc
  // http://localhost:5000/api/posts?page=3&limit=5&sortBy=createdAt&sortOrder=desc&category=Next

  try {
    let posts;
    let total;

    if (category) {
      const categoryCondition = { category };
      total = await Post.countDocuments(categoryCondition);
      posts = await Post.find(categoryCondition)
        .populate("author")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 }) // { createdAt: -1 } for descending order and { createdAt: 1 } for ascending order .
        .skip((page - 1) * limit)
        // page1: skip 0, limit 5 => (1-1) * 5 = 0 => show first 5 posts
        // page2: skip 5, limit 5 => (2-1) * 5 = 5 => show next 5 posts and skip first 5 posts
        // page3: skip 10, limit 5 => (3-1) * 5 = 10 => show next 5 posts and skip first 10 posts
        .limit(limit);
    } else {
      total = await Post.countDocuments();
      posts = await Post.find({})
        .populate("author")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    res.json({
      meta: {
        page,
        limit,
        total,
      },
      data: posts,
    });
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=           Fetch Single Post            =
=============================================*/
const fetchSinglePostCtrl = expressAsyncHandler(async (req, res) => {
  const postId = req.params.postId;
  validateMongoDbId(postId);
  try {
    const post = await Post.findById(postId)
      .populate("author")
      .populate("likes")
      .populate("disLikes")
      .populate("comments");

    // Update number of views

    await Post.findByIdAndUpdate(
      postId,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    // post.numViews = post.numViews + 1;
    // await post.save()
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=              Update Post          =
=============================================*/
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const postId = req.params.postId;
  validateMongoDbId(postId);

  try {
    // Find the post
    const post = await Post.findById(postId);

    // Find the old and new categories
    const oldCategory = await Category.findOne({ title: post.category });
    const newCategory = await Category.findOne({ title: req.body.category });

    console.log("oldCategory", oldCategory);
    console.log("newCategory", newCategory);

    // // Update the post details
    post.set({
      ...req.body,
      category: newCategory?.title, // Update the category reference
    });
    const updatedPost = await post.save();

    if (updatedPost.category === newCategory.title) {
      // Decrement the postCount of the old category
      await Category.findByIdAndUpdate(
        oldCategory._id,
        { $inc: { postCount: -1 } },
        { new: true }
      );

      // Increment the postCount of the new category
      await Category.findByIdAndUpdate(
        newCategory._id,
        { $inc: { postCount: 1 } },
        { new: true }
      );
    }

    res.json(updatedPost);
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=    		Delete Post        =
=============================================*/
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const postId = req.params.postId;
  validateMongoDbId(postId);

  try {
    const post = await Post.findById(postId);
    const category = await Category.findOne({ title: post.category });
    const deletedPost = await Post.findByIdAndDelete(postId);
    // Decrement the postCount of the corresponding category
    await Category.findByIdAndUpdate(
      category._id,
      { $inc: { postCount: -1 } },
      { new: true }
    );
    res.json(deletedPost);
  } catch (error) {
    res.json(error);
  }
});

/*=============================================
=    		Like Post        =
=============================================*/

const likePostctrl = expressAsyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { _id } = req.headers.user;

  validateMongoDbId(postId);

  try {
    const post = await Post.findById(postId);
    if (!post.likes.includes(_id)) {
      post.isLiked = true;
      post.likes.push(_id);

      // if user dislike the post
      post.isDisLiked = false;
      post.disLikes.pull(_id);
    } else {
      // if user already like the post then toggle to default
      post.isDisLiked = false;
      post.isLiked = false;

      post.likes.pull(_id);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});
/*=============================================
=    		DisLike Post        =
=============================================*/

const disLikePostctrl = expressAsyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { _id } = req.headers.user;

  validateMongoDbId(postId);

  try {
    const post = await Post.findById(postId);
    if (!post.disLikes.includes(_id)) {
      post.isDisLiked = true;
      post.disLikes.push(_id);

      // if user already like the  post then remove it
      post.isLiked = false;
      post.likes.pull(_id);
    } else {
      // if user already dislike then toggle  to default
      post.isDisLiked = false;
      post.isLiked = false;

      post.disLikes.pull(_id);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchSinglePostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  likePostctrl,
  disLikePostctrl,
};
