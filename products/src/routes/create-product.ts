import express, { Request, Response } from "express";
import { Product } from "../models/productModel";
import { Subjects, isAdminUser } from "@farmmicro/common";
import { natsWrapper } from "../nats-wrapper";
import { ProductCreatedPublisher } from "../events/publishers/prodcut-created-publisher";

const route = express.Router();

//@desc    Create product
//@api     POST /api/products
//@access  Private/ ADMIN
route.post(
  "/api/products",
  isAdminUser,
  async (req: Request, res: Response) => {
    const product = Product.build({
      name: "sample name",
      image: "/images/sample.jpg",
      description: "sample description",
      category: "sample category",
      brand: "sample brand",
      user: req.currentUser!.id,
      price: 0,
      countInStock: 0,
    });

    await product.save();

    new ProductCreatedPublisher(natsWrapper.client).publish({
      id: product.id,
      price: product.price,
      countInStock: product.countInStock,
      version: product.version,
    });

    res.status(201).send(product);
  }
);

export { route as createProductRouter };
