import {
  BadRequestError,
  NotAuthorized,
  NotFoundError,
  OrderStatus,
  isAdminUser,
  requireAuth,
} from "@farmmicro/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orderModel";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

//@desc    Cancel order
//@api     DELETE /api/orders/:id
//@access  private
router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (req.currentUser!.id != order.user) {
      throw new NotAuthorized();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Already order cancelled");
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      orderItems: order.orderItems,
      version: order.version,
    });

    res.status(204).send();
  }
);

export { router as orderCancelRouter };
