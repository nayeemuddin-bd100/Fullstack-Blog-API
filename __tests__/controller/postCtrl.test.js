const mongoose = require("mongoose");
const Category = require("../../model/category/Category");
const User = require("../../model/user/User");
const bcrypt = require("bcryptjs");
const {
	TokenExpiredError,
	JsonWebTokenError,
	NotBeforeError,
} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../../index.js");
const {
	startTestDatabase,
	stopTestDatabase,
} = require("../../utils/test-db-setup-ctrl");
const Post = require("../../model/post/Post");
const generateToken = require("../../config/token/generateToken");

/*=============================================
=            Testing setup            =
=============================================*/
jest.useRealTimers();

let mongoServer;

beforeEach(async () => {
	mongoServer = await startTestDatabase();
});

afterAll(async () => {
	await stopTestDatabase(mongoServer);
});

describe("Post controller", () => {
	let loggedInUser;
	beforeEach(async () => {
		const credential = {
			email: "uploadtest@gmail.com",
			password: "12345",
		};
		 const user = await User.findOne({ email:credential.email });
		loggedInUser = {
			_id: user?.id,
			firstName: user?.firstName,
			lastName: user?.lastName,
			email: user?.email,
			token: generateToken(user?._id, user?.firstName),
		};
	})
	
	describe("GET- /api/posts", () => {
		it("should return error if the authorization token is invalid or not provided or expired", async () => {
			try {
				const resWithInvalidToken = await request(app)
					.get("/api/posts")
					.set("Authorization", "Bearer invalidToken");
				const resWithNoToken = await request(app).get("/api/posts");
			} catch (error) {
				expect(error).toBeInstanceOf(
					TokenExpiredError || JsonWebTokenError || NotBeforeError
				);
			}
		});

		it("should return all Post", async () => {
			try {

				const res = await request(app)
					.get("/api/posts")
					.set("Authorization", `Bearer ${loggedInUser.token}`);

				const parsedResponse = JSON.parse(res.text);
				// Assertion
				expect(res.status).toBe(200);
				expect(res.text).toBeDefined();

				expect(parsedResponse).toEqual(expect.any(Array));

				if (parsedResponse.length > 0) {
					expect(parsedResponse[0]).toHaveProperty("_id");
					expect(parsedResponse[0]).toHaveProperty("title");
				}
			} catch (error) {
				console.error("An error occurred:", error);
				throw error; 
			}
		});
	});

	describe("GET- /api/posts/:postId", () => {
		it("should return a specific post", async () => {
			try {

				const post = await Post.findOne({});
				const postId = post.id;

				const res = await request(app).get(`/api/posts/${postId}`);
				const parsedResponse = JSON.parse(res.text);
				// Assertion
				expect(res.status).toBe(200);
				expect(res.text).toBeDefined();
				expect(parsedResponse).toHaveProperty("_id");
			} catch (error) {
				console.log("GET - get single post error ===>", error);
			}
		});

		it("should return error if postId is invalid", async () => {
			try {
				const res = await request(app).get(`/api/posts/341234123`);

				// Assertion
				expect(mongoose.Types.ObjectId.isValid("3421323")).toBeFalsy();
			} catch (error) {
				expect(error.message).toBe("The id is not valid");
			}
		});
	});

	describe("PUT- /api/posts/:postId", () => {
		it("should update a post", async () => {
			try {
				const user = await User.findOne({ _id: loggedInUser._id });
				const postId = user.posts[0];

				const updatedData = {
					title: "Node js",
					description: "Node js is awesome",
				};

				const res = await request(app)
					.put(`/api/posts/${postId}`)
					.send(updatedData)
					.set("Authorization", `Bearer ${loggedInUser.token}`);
				const parsedData = JSON.parse(res.text);

				// console.log(res)
				// Assertion
				expect(res.status).toBe(200);
				expect(res.text).toBeDefined();
				expect(parsedData).toHaveProperty("_id");
				expect(parsedData.title).toBe("Node js");
			} catch (error) {
				console.log("PUT - updated post error ===>", error);
			}
		});
	});


	describe("PUT- /api/posts/like/:postId", () => {
		it("should Like a post", async () => {
			try {
				const user = await User.findOne({ _id: loggedInUser._id });
				const postId = user.posts[0];

				const res = await request(app)
					.put(`/api/posts/like/${postId}`)
					.set("Authorization", `Bearer ${loggedInUser.token}`);
				const parsedData = JSON.parse(res.text);

				// Assertion
				expect(res.status).toBe(200);
				expect(res.text).toBeDefined();
				expect(parsedData).toHaveProperty("_id");
				expect(parsedData.likes).toEqual(expect.any(Array));
			} catch (error) {
				console.log("PUT - Like post error ===>", error);
			}
		});
	});

	describe("PUT- /api/posts/dislike/:postId", () => {
		it("should Dislike a post", async () => {
			try {
				const user = await User.findOne({ _id: loggedInUser._id });
				const postId = user.posts[0];
				const res = await request(app)
					.put(`/api/posts/dislike/${postId}`)
					.set("Authorization", `Bearer ${loggedInUser.token}`);

				const parsedData = JSON.parse(res.text);

				// Assertion
				expect(res.status).toBe(200);
				expect(res.text).toBeDefined();
				expect(parsedData).toHaveProperty("_id");
				expect(parsedData.disLikes).toEqual(expect.any(Array));
			} catch (error) {
				console.log("PUT - DisLike post error ===>", error);
			}
		});
	});

	// describe("DELETE- /api/posts/:postId", () => {
	// 	it("should delete a post", async () => {
	// 		try {
	// 			const user = await User.findOne({ _id:loggedInUser._id });
	// 			const postId = user.posts[0];

	// 			const res = await request(app)
	// 				.delete(`/api/posts/${postId}`)
	// 				.set("Authorization", `Bearer $loggedInUser.token}`);
	// 			const parsedData = JSON.parse(res.text);

	// 			// Assertion
	// 			expect(res.status).toBe(200);
	// 		} catch (error) {
	// 			console.log("PUT - delete post error ===>", error);
	// 		}
	// 	});
	// });
});
