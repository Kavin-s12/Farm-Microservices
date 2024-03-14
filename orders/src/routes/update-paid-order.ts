import { NotFoundError, requireAuth } from "@farmmicro/common";
import express from "express";
import { Order } from "../models/orderModel";

const router = express.Router();

//@desc    Update order to Paid
//@api     PUT /api/order/:id/pay
//@access  private
router.put("/api/orders/:id/pay", requireAuth, async (req, res) => {
  const foundOrder = await Order.findById(req.params.id);
  const { id, status, update_time, email_address } = req.body;

  if (!foundOrder) {
    throw new NotFoundError("Order not found");
  }
  foundOrder.isPaid = true;
  foundOrder.paidAt = new Date();
  foundOrder.paymentResult = {
    id,
    status,
    update_time,
    email_address,
  };

  const updatedOrder = await foundOrder.save();

  res.send(updatedOrder);
});

export { router as updatePaidOrderRouter };
