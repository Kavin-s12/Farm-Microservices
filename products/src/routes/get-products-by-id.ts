import express, { Request, Response } from "express";
import { Product } from "../models/productModel";
import { NotFoundError } from "@farmmicro/common";

const route = express.Router();

//@desc     fetch single product by ID
//@api      GET /api/products/:id
//@access   public
route.get("/api/products/:id", async (req: Request, res: Response) => {
  const foundProduct = await Product.findById(req.params.id);
  if (!foundProduct) {
    throw new NotFoundError("Product not found");
  }

  // const serializedProduct = JSON.stringify(foundProduct);
  // redisClient.setEx(req.params.id, 3600, serializedProduct);
  res.status(200).send(foundProduct);
});

export { route as getProductsByIdRouter };
