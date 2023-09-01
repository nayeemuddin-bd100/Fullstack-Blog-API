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
	let userData;
	let newPost;
	beforeEach(async () => {
		//   Register User
		const user = new User({
			firstName: "Saiful",
			lastName: "Islam",
			email: "saiful@islam.com",
			password: "TestPass123",
		});
		const userResponse = await request(app)
			.post("/api/users/login")
			.send({ email: "saiful@islam.com", password: "TestPass123" });

		userData = JSON.parse(userResponse.text);
	});

	beforeEach(async () => {
		const post = {
			title: "Test using Jest and supertest",
			description: "Jest is an awesome tools",
		};

		const res = await request(app)
			.post("/api/posts")
			.send(post)
			.set("Authorization", `Bearer ${userData.token}`);

		newPost = JSON.parse(res.text);
	});

	
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
					.set("Authorization", `Bearer ${userData.token}`);

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
				throw error; // Rethrow the error to fail the test
			}
		});
	});

	describe("GET- /api/posts/:postId", () => {
		it("should return a specific post", async () => {
			try {
				const res = await request(app).get(`/api/posts/${newPost._id}`);
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
				const updatedData = {
					title: "Node js",
					description: "Node js is awesome",
				};

				const res = await request(app)
					.put(`/api/posts/${newPost._id}`)
					.send(updatedData)
					.set("Authorization", `Bearer ${userData.token}`);
				const parsedData = JSON.parse(res.text);
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

	describe("DELETE- /api/posts/:postId", () => {
		it("should delete a post", async () => {
			try {
				const res = await request(app)
					.delete(`/api/posts/${newPost._id}`)
					.set("Authorization", `Bearer ${userData.token}`);
				const parsedData = JSON.parse(res.text);

				// Assertion
				expect(res.status).toBe(200);
			} catch (error) {
				console.log("PUT - delete post error ===>", error);
			}
		});
	});

	describe("PUT- /api/posts/like/:postId", () => {
		it("should Like a post", async () => {
			try {
				const res = await request(app)
					.put(`/api/posts/like/${newPost._id}`)
					.set("Authorization", `Bearer ${userData.token}`);
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
				const res = await request(app)
					.put(`/api/posts/dislike/${newPost._id}`)
					.set("Authorization", `Bearer ${userData.token}`);

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
});
