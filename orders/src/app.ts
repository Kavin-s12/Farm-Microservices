import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@farmmicro/common";
import { myOrderRouter } from "./routes/my-order";
import { createOrderRouter } from "./routes/create-order";
import { getOrderByIdRouter } from "./routes/get-order-by-id";
import { updateDeliveredOrderRouter } from "./routes/update-delivered-order";
import { updatePaidOrderRouter } from "./routes/update-paid-order";
import { orderCancelRouter } from "./routes/order-cancel";
import { getAllOrderRouter } from "./routes/get-all-orders";

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
app.use(myOrderRouter);
app.use(createOrderRouter);
app.use(getOrderByIdRouter);
app.use(updateDeliveredOrderRouter);
app.use(updatePaidOrderRouter);
app.use(orderCancelRouter);
app.use(getAllOrderRouter);

app.all("*", async () => {
  throw new NotFoundError("Route not found");
});

app.use(errorHandler);

export { app };
