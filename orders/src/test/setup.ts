import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import { Product } from "../models/productModel";
import { OrderItem, ShippingAddress } from "../models/order";

jest.mock("../nats-wrapper");

export interface OrderTest {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

declare global {
  var signup: (isAdmin?: boolean) => string[];
  var testData: () => Promise<OrderTest>;
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

global.signup = (isAdmin = false) => {
  const payload = {
    email: "test@test.com",
    id: new mongoose.Types.ObjectId(),
    isAdmin: isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJson = JSON.stringify(session);
  const base64 = Buffer.from(sessionJson).toString("base64");

  return [`session=${base64}`];
};

global.testData = async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
    countInStock: 18,
  });
  await product.save();

  const data = {
    orderItems: [
      {
        name: "test name",
        qty: 10,
        price: 100,
        image: "image",
        productId: product.id,
      },
    ],
    shippingAddress: {
      address: "123",
      postalCode: 123456,
      city: "Test city",
      country: "Test country",
    },
    paymentMethod: "strip",
    itemsPrice: 1000,
    taxPrice: 80,
    shippingPrice: 0,
    totalPrice: 1080,
  };
  return data;
};
