const mongoose = require("mongoose");
const Category = require("../../model/category/Category");
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
	await stopTestDatabase(mongoServer);
});

describe("Category Model - unit test", () => {
	let testUser;
	beforeEach(async () => {
		const user = new User({
			firstName: "Nayeem",
			lastName: "Uddin",
			email: "nayeem@gmail.com",
			password: "password123",
		});

		testUser = await User.create(user);
	});

	it("should create new category", async () => {
		const category = new Category({
			user: testUser._id,
			title: "NodeJs",
		});

		const savedCategory = await category.save();

		expect(savedCategory._id).toBeDefined();
		expect(savedCategory.user).toBeInstanceOf(mongoose.Types.ObjectId);
		expect(savedCategory.user).toBe(testUser._id);
		expect(savedCategory.title).toEqual(expect.any(String));
	});

	it("should return validation error", async () => {
		const category = new Category({});

		try {
			const savedCategory = await category.save();
		} catch (error) {
			expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
		}
	});
});
