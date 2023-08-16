const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const startTestDatabase = async () => {
	const mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	return mongoServer;
};

const stopTestDatabase = async (mongoServer) => {
	await mongoose.disconnect();
	await mongoServer.stop();
};



module.exports = { startTestDatabase, stopTestDatabase };
