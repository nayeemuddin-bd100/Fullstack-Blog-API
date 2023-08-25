
const mongoose = require("mongoose");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const {
	startTestDatabase,
	stopTestDatabase,
} = require("../../utils/test-db-setup");

let mongoServer

beforeEach(async () => {
    mongoServer = await startTestDatabase();
})

afterEach(async() => {
    await stopTestDatabase(mongoServer);
});

describe("Post model", () => {
    let testUser;
    beforeEach(async () => {
        const newUser = new User({
			firstName: "Nayeem",
			lastName: "Uddin",
			email: "nayeem@gmail.com",
			password: "password123",
        });
        
        testUser = await User.create(newUser);
    })

    it("should create a new post", async () => {
        const post = new Post({
					title: "New post 1",
					category: "TestCase",
					description: "Hello world",
					author: testUser._id
				});
        
        const savedPost = await post.save();
        expect(savedPost._id).toBeDefined();
        expect(savedPost.likes).toEqual(expect.any(Array));
        expect(savedPost.author).toBeInstanceOf(mongoose.Types.ObjectId);
        expect(savedPost.author).toBe(testUser._id)
        expect(savedPost.numViews).toEqual(expect.any(Number));
        expect(savedPost.likes.every(_id => _id instanceof mongoose.Types.ObjectId)).toBeTruthy();

    })
})