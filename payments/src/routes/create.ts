import {
  BadRequestError,
  NotAuthorized,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@farmmicro/common";
import express, { Request, Response } from "express";
import { Order } from "../model/orderModel";
import { body } from "express-validator";
import { Payment } from "../model/paymentModel";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { verifyToken } from "../functions/verifyPayment";
const route = express.Router();

route.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("token must be provided"),
    body("orderId")
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage("Order ID should not be empty and valid mongoose object"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.user !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order already cancelled");
    }

    if (order.status === OrderStatus.Completed) {
      throw new BadRequestError("Order already paid");
    }

    await verifyToken(token, order);

    const payment = Payment.build({
      user: req.currentUser!.id,
      orderId,
      razorPayId: token,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      razorPayId: payment.razorPayId,
      paidAt: new Date(),
    });

    res.status(201).send({ id: payment.id });
  }
);

export { route as createChargeRouter };
