import express, { Request, Response } from "express";
import { Product } from "../models/productModel";
const route = express.Router();

//@desc     fetch all product
//@api      GET /api/products/
//@access   public
route.get("/api/products", async (req: Request, res: Response) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.status(200).send({ products, page, pages: Math.ceil(count / pageSize) });
});

export { route as getProductsRouter };
