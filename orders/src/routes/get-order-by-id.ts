import { NotAuthorized, NotFoundError, requireAuth } from "@farmmicro/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orderModel";

const router = express.Router();

//@desc    Get orders by ID
//@api     GET /api/orders/:id
//@access  private
router.get("/api/orders/:id", requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (req.currentUser!.id != order.user) {
    throw new NotAuthorized();
  }

  res.status(200).send(order);
});

export { router as getOrderByIdRouter };
