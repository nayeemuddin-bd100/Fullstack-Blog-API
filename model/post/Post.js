const mongoose = require("mongoose");

// Post Schema
const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Post title is required"],
			trim: true,
		},
		category: {
			type: String,
			required: [true, "Post category is required"],
			default: "All",
		},
		isLiked: {
			type: Boolean,
			default: false,
		},
		isDisLiked: {
			type: Boolean,
			default: false,
		},
		numViews: {
			type: Number,
			default: 0,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		disLikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Author is required"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
		},
		image: {
			type: String,
			default:
				"https://media.istockphoto.com/id/677059814/photo/one-man-camping-at-night-with-phone.jpg?b=1&s=170667a&w=0&k=20&c=nFFhoBRTP7zkNXDo_m_EVCdWjr0dxthPDRJ94EFUxaM=",
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
