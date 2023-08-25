const mongoose = require("mongoose");
const Category = require("../../model/category/Category");
const User = require("../../model/user/User");
// const { connectTestMongoDb, disconnectTestMongoDb } = require("../../utils/test-mongodb-setup");
const request = require("supertest");
const app = require("../../index");
const {
	startTestDatabase,
	stopTestDatabase,
} = require("../../utils/test-db-setup-ctrl");

jest.useRealTimers();



let mongoServer;

beforeAll(async () => {
	mongoServer = await startTestDatabase();
});

afterAll(async () => {
	await stopTestDatabase(mongoServer);
});
it('should blah blah', async() => {
   // test code...
   
})

