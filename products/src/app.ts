import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@farmmicro/common";
import { getProductsRouter } from "./routes/get-products";
import { getProductsByIdRouter } from "./routes/get-products-by-id";
import { createProductRouter } from "./routes/create-product";
import { updateProductRouter } from "./routes/update-product";
import { deleteProductRouter } from "./routes/delete-product";
import { topReviewRouter } from "./routes/top-review";
import { addReviewRouter } from "./routes/add-review";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(addReviewRouter);
app.use(getProductsRouter);
app.use(topReviewRouter);
app.use(getProductsByIdRouter);
app.use(createProductRouter);
app.use(updateProductRouter);
app.use(deleteProductRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError("Route not found");
});

app.use(errorHandler);

export { app };
