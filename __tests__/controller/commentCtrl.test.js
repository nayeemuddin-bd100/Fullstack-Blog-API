const mongoose = require("mongoose");
const Comment = require("../../model/comment/Comment");
const User = require("../../model/user/User");
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

afterEach(async () => {
	await stopTestDatabase(mongoServer);
});
it('should return error if contain empty comment', async() => {
   // test code...
   
})

