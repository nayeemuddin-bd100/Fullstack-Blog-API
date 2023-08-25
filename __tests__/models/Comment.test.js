const mongoose = require("mongoose");
const Comment = require("../../model/comment/Comment");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const {
	startTestDatabase,
	stopTestDatabase,
} = require("../../utils/test-db-setup");

let mongoServer;

beforeEach(async () => {
	mongoServer = await startTestDatabase();
});

afterEach(async () => {
	stopTestDatabase(mongoServer);
});

describe("Comment Model - unit test", () => {
    // create a user and post before comment to refer comment author and post id
	let testPost;
	let testUser;
	beforeEach(async () => {
		const user = new User({
			firstName: "Nayeem",
			lastName: "Uddin",
			email: "nayeem@gmail.com",
			password: "password123",
		});

		testUser = await User.create(user);

		const post = new Post({
			title: "New post 1",
			category: "TestCase",
			description: "Hello world",
			author: testUser._id,
		});

		testPost = await Post.create(post);
	});

	// Test case :
	it("should create a new comment", async () => {
		const comment = new Comment({
			post: testPost._id,
			author: testUser,
			description: "Testing comment by jest",
		});

		const savedComment = await comment.save();

		//Assertion
		expect(savedComment._id).toBeDefined();
		expect(savedComment.post).toBeInstanceOf(mongoose.Types.ObjectId);
		expect(savedComment.post).toBe(testPost._id);
		expect(savedComment.author).toEqual(expect.any(Object));
		expect(savedComment.author).toBe(testUser);
	});

	// Test case :
	it("should return validation error", async () => {
		const comment = new Comment({});

		try {
			await comment.save();
		} catch (error) {
			expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
		}
	});
});
