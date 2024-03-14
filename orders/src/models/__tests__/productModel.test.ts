import mongoose from "mongoose";
import { Product } from "../productModel";

it("implements optimistic concurrency control", async () => {
  // create an ibstance of a product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
    countInStock: 18,
  });
  await product.save();

  // fetch the product twice
  const firstInstance = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);

  // make two seperate changes to the product fetched
  firstInstance!.set({ price: 150 });
  secondInstance!.set({ price: 150 });

  // save the first fetched product
  await firstInstance!.save();

  // save the first fetched product and expect an error
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach here");
});
