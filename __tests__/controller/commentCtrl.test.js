const mongoose = require("mongoose");
const Comment = require("../../model/comment/Comment");
const User = require("../../model/user/User");
const Post = require("../../model/post/Post");
const request = require("supertest");
const app = require("../../index");
const {
	startTestDatabase,
	stopTestDatabase,
} = require("../../utils/test-db-setup-ctrl");


jest.useRealTimers();

let mongoServer;

beforeEach(async () => {
	mongoServer = await startTestDatabase();
});

afterAll(async () => {
	await stopTestDatabase(mongoServer);
});

describe("Comment Controller", () => {
	let userData;
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


	describe("POST - /api/comments/", () => {
		it("should return error if the authorization token is invalid or not provided or expired", async () => {
			try {
				const resWithInvalidToken = await request(app)
					.get("/api/comments")
					.set("Authorization", "Bearer invalidToken");
				const resWithNoToken = await request(app).get("/api/comments");
			} catch (error) {
				expect(error).toBeInstanceOf(
					TokenExpiredError || JsonWebTokenError || NotBeforeError
				);
			}
		});
		it("should create a comment", async () => {

			const post = await Post.findOne({})
			const postId = post.id;

			const comment = {
				postId,
				description: "testing last",
			};

			const res = await request(app)
				.post("/api/comments")
				.send(comment)
				.set("Authorization", `Bearer ${userData.token}`);

			const parsedResponse = JSON.parse(res.text);

			expect(res.status).toBe(200);
			expect(res.text).toBeDefined();
			expect(parsedResponse.description).toBe("testing last");
		});

		it("should return error if contain empty comment", async () => {
				const post = await Post.findOne({});
				const postId = post.id;
			const comment = {
				postId,
				description: "",
			};

			const res = await request(app)
				.post("/api/comments")
				.send(comment)
				.set("Authorization", `Bearer ${userData.token}`);

			const parsedResponse = JSON.parse(res.text);
			expect(parsedResponse.name).toBe("ValidationError");
		});
	});

	describe("GET - /api/comments/", () => {
		it("should return all comments", async () => {
			const res = await request(app)
				.get("/api/comments")
				.set("Authorization", `Bearer ${userData.token}`);

			const parsedResponse = JSON.parse(res.text);

			// Assertion
			expect(res.status).toBe(200);
			expect(res.text).toBeDefined();
			expect(parsedResponse).toBeInstanceOf(Array);

		});
	});

	describe("GET - /api/comments/:commentId", () => {
		it("should return a specific comments", async () => {
			
			const comment = await Comment.findOne({});
			const commentId = comment._id.toString();
			const res = await request(app)
				.get(`/api/comments/${commentId}`)
				.set("Authorization", `Bearer ${userData.token}`);

			const parsedResponse = JSON.parse(res.text);

			// Assertion
			expect(res.status).toBe(200);
			expect(res.text).toBeDefined();
			expect(parsedResponse._id).toBe(commentId);
		});
	});

	describe("PUT - /api/comments/:commentId", () => {
		it("should update a comment", async () => {

			const comment = await Comment.findOne({});
			const commentId = comment._id.toString();

			updatedComment = {
				description: "updating Integrated testing",
			};
			const res = await request(app)
				.put(`/api/comments/${commentId}`)
				.send(updatedComment)
				.set("Authorization", `Bearer ${userData.token}`);

			const parsedResponse = JSON.parse(res.text);

			// Assertion
			expect(res.status).toBe(200);
			expect(res.text).toBeDefined();
			expect(parsedResponse._id).toBe(commentId);
			expect(parsedResponse.description).toBe(updatedComment.description);
		});
	});
	describe("DELETE - /api/comments/:commentId", () => {
		it("should delete a comment", async () => {

			const comment = await Comment.findOne({});
			const commentId = comment._id.toString();
			
			const res = await request(app)
				.delete(`/api/comments/${commentId}`)
				.set("Authorization", `Bearer ${userData.token}`);

			const parsedResponse = JSON.parse(res.text);

			// Assertion
			expect(res.status).toBe(200);
			expect(res.text).toBeDefined();
			expect(parsedResponse._id).toBe(commentId);
		});
	});
});

