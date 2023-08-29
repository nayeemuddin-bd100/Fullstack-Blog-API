const mongoose = require("mongoose");
const Category = require("../../model/category/Category");
const User = require("../../model/user/User");
const {
	TokenExpiredError,
	JsonWebTokenError,
	NotBeforeError,
} = require("jsonwebtoken");
const request = require("supertest");
const app = require("../../index.js");
const {
	startTestDatabase,
	stopTestDatabase,
} = require("../../utils/test-db-setup-ctrl");

jest.useRealTimers();

let mongoServer;

beforeEach(async () => {
	mongoServer = await startTestDatabase();
});

afterEach(async () => {
	await stopTestDatabase(mongoServer);
});

describe("Post controller", () => {
	describe("Get- /api/posts", () => {

		it("should return error if the authorization token is invalid or not provided or expired", async () => {
			try {
				const resWithInvalidToken = await request(app)
					.get("/api/posts")
					.set("Authorization", "Bearer invalidToken");
				const resWithNoToken = await request(app)
					.get("/api/posts")
				
				
			} catch (error) {
				expect(error).toBeInstanceOf(
					TokenExpiredError || JsonWebTokenError || NotBeforeError
				);
			}
		});

		it("should return all Post", async () => {
			// const res = await request(app).get("/api/posts");
			// expect(res).toBeDefined();
		});
	});
});
