import express from "express";
import { Product } from "../models/productModel";
const route = express.Router();

//@desc     fetch Top 3 review product
//@api      GET /api/products/topreview
//@access   public
route.get("/api/products/topreview", async (req, res) => {
  const foundProduct = await Product.find().sort({ review: -1 }).limit(3);

  res.status(200).send(foundProduct);
});

export { route as topReviewRouter };
