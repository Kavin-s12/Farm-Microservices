import express, { Request, Response } from "express";
import { Product } from "../models/productModel";
import { isAdminUser, NotAuthorized, NotFoundError } from "@farmmicro/common";
import { ProductUpdatedPublisher } from "../events/publishers/product-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const route = express.Router();

//@desc    update product
//@api     PUT /api/products/:id
//@access  Private/ ADMIN
route.put(
  "/api/products/:id",
  isAdminUser,
  async (req: Request, res: Response) => {
    const { name, image, description, category, brand, countInStock, price } =
      req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (req.currentUser!.id != product.user) {
      throw new NotAuthorized();
    }

    product.name = name || product.name;
    product.image = image || product.image;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.countInStock = countInStock || product.countInStock;
    product.price = price || product.price;

    await product.save();

    if (price || countInStock) {
      new ProductUpdatedPublisher(natsWrapper.client).publish({
        id: product.id,
        price: product.price,
        countInStock: product.countInStock,
        version: product.version,
      });
    }

    res.send(product);
  }
);

export { route as updateProductRouter };
