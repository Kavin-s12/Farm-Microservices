import {
  NotAuthorized,
  NotFoundError,
  isAdminUser,
  requireAuth,
} from "@farmmicro/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orderModel";

const router = express.Router();

//@desc    Get my orders list
//@api     GET /api/orders
//@access  private Admin
router.get("/api/orders", isAdminUser, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  //.populate("user", "name email")
  res.send(orders);
});

export { router as getAllOrderRouter };
