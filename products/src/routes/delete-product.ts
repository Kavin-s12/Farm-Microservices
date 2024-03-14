import express, { Request, Response } from "express";
import { Product } from "../models/productModel";
import { NotAuthorized, NotFoundError, isAdminUser } from "@farmmicro/common";
import { ProductDeletedPublisher } from "../events/publishers/product-deleted-publisher";
import { natsWrapper } from "../nats-wrapper";

const route = express.Router();

//@desc    Delete product
//@api     DELETE /api/products/:id
//@access  Private/ ADMIN
route.delete(
  "/api/products/:id",
  isAdminUser,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (req.currentUser!.id != product.user) {
      throw new NotAuthorized();
    }

    await Product.findByIdAndDelete(req.params.id);

    new ProductDeletedPublisher(natsWrapper.client).publish({
      id: product.id,
      version: product.version + 1,
    });

    res.status(204).send();
  }
);

export { route as deleteProductRouter };
