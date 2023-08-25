const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const startTestDatabase = async () => {
	const mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();

	// this line not working for mongodb memory server
	// await mongoose.createConnection(mongoUri, {
	await mongoose.createConnection(mongoUri, {
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
