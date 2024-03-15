import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";

jest.mock("../nats-wrapper");
jest.mock("../razorpay");

declare global {
  var signin: (id?: string) => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "IamTest";
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  const payload = {
    email: "test@test.com",
    id: id || new mongoose.Types.ObjectId(),
    isAdmin: true,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJson = JSON.stringify(session);
  const base64 = Buffer.from(sessionJson).toString("base64");

  return [`session=${base64}`];
};
