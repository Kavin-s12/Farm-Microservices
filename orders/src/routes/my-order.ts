import { isAdminUser, requireAuth } from "@farmmicro/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orderModel";

const router = express.Router();

//@desc    Get my orders list
//@api     GET /api/orders/myorder
//@access  private
router.get(
  "/api/orders/myorder",
  requireAuth,
  async (req: Request, res: Response) => {
    const myOrders = await Order.find({ user: req.currentUser!.id });
    res.send(myOrders);
  }
);

export { router as myOrderRouter };
