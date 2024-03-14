import { NotFoundError, isAdminUser } from "@farmmicro/common";
import express from "express";
import { Order } from "../models/orderModel";

const router = express.Router();

//@desc    Update order to delievred
//@api     PUT /api/:id/delivered
//@access  private Admin
router.put("/api/orders/:id/delivered", isAdminUser, async (req, res) => {
  const foundOrder = await Order.findById(req.params.id);

  if (!foundOrder) {
    throw new NotFoundError("Order not found");
  }
  foundOrder.isDelivered = true;
  foundOrder.deliveredAt = new Date();

  const updatedOrder = await foundOrder.save();

  res.send(updatedOrder);
});

export { router as updateDeliveredOrderRouter };
