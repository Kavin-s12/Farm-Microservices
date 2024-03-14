import express from "express";
import { Product } from "../models/productModel";
import { NotFoundError, requireAuth } from "@farmmicro/common";
const route = express.Router();

//@desc    Create new review
//@api     PUT /api/products/:id/review
//@access  Private
route.post("/api/products/:id/reviews", requireAuth, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new NotFoundError("product not found");
  }
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() == req.currentUser!.id.toString()
  );

  if (alreadyReviewed) {
    res.status(404);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.currentUser!.email,
    rating: Number(rating),
    comment,
    user: req.currentUser!.id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: "Review added" });
});

export { route as addReviewRouter };
