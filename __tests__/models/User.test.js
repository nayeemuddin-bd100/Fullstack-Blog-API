const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const {
	startTestDatabase,
	stopTestDatabase,
} = require("../../utils/test-db-setup");
let mongoServer;


beforeAll(async () => {
	mongoServer = await startTestDatabase();
});

afterAll(async () => {
	await stopTestDatabase(mongoServer);
});


// Test suite for User model
describe("User Model", () => {

	it("should create new user", async () => {
		const user = new User({
			firstName: "Nayeem",
			lastName: "Uddin",
			email: "nayeem@gmail.com",
			password: "password123",
		});

		const savedUser = await user.save();

		// Assertion
		expect(savedUser._id).toBeDefined();
		expect(savedUser.firstName).toBe("Nayeem");
		expect(savedUser.lastName).toBe("Uddin");
		expect(savedUser.email).toBe("nayeem@gmail.com");
		expect(savedUser.isFollowing).toBe(false);
		expect(typeof savedUser.isAdmin).toBe("boolean");
		expect(savedUser._id).toBeInstanceOf(mongoose.Types.ObjectId);
	});

	it("should not keep blank to user data", async () => {
		try {
			const user = new User({});
			await user.save();
		} catch (error) {
			expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
		}
	});

	it("should hash password before save into database", async () => {
		const user = new User({
			firstName: "Saiful",
			lastName: "Islam",
			email: "saiful@islam.com",
			password: "TestPass123",
		});
		const savedUser = await user.save();
		const passwordMatched = await bcrypt.compare(
			"TestPass123",
			savedUser.password
		);

		// Assertion
		expect(passwordMatched).toBe(true);
	});
});
