import mongoose from "mongoose";
import { Product } from "./models/productModel";
import products from "./data/products";
import { ProductCreatedPublisher } from "./events/publishers/prodcut-created-publisher";
import { natsWrapper } from "./nats-wrapper";

const connectdb = async () => {
  try {
    if (process.env.MONGO_URI) {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB connected : ${conn.connection.host}`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectdb();

export const importData = async () => {
  try {
    await Product.deleteMany();

    const user = new mongoose.Types.ObjectId();

    for (const product of products) {
      const createdProduct = Product.build({ ...product, user });

      await createdProduct.save();

      new ProductCreatedPublisher(natsWrapper.client).publish({
        id: createdProduct.id,
        price: createdProduct.price,
        countInStock: createdProduct.countInStock,
        version: createdProduct.version,
      });
    }
    console.log("Imported Data");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();

    console.log("Destroyed Data");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] == "-d") {
  destroyData();
} else {
  importData();
}
