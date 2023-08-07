const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const validateMongoDbId = require("../../utils/validateMongoDbId")


const createPostCtrl = expressAsyncHandler(async (req,res) => {

    const {_id} = req.headers.user
    validateMongoDbId(_id)
    try {
        const post = await Post.create({...req.body, author : _id});
        res.json(post)
    } catch (error) {
        res.json(error);
    }
})

module.exports = {
    createPostCtrl
}