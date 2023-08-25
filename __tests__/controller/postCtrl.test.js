const mongoose = require("mongoose");
const Category = require("../../model/category/Category");
const User = require("../../model/user/User");
// const { connectTestMongoDb, disconnectTestMongoDb } = require("../../utils/test-mongodb-setup");
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
		it("should return all Post", async () => {
			// const res = await request(app).get("/api/posts");
	
			// expect(res).toBeDefined();
			
		});
	});
});
