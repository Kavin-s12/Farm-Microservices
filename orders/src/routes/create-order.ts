import {
  BadRequestError,
  NotFoundError,
  priceCalculator,
  requireAuth,
  validateRequest,
} from "@farmmicro/common";
import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/orderModel";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Product } from "../models/productModel";
import { OrderItem } from "../models/order";
import { orderValidation } from "./validations/order-validation";

const router = express.Router();

export const EXPIRATION_WINDOW_SECONDS = 5 * 60;

const validateOrderItems = async (orderItems: OrderItem[]) => {
  for (const item of orderItems) {
    const productItem = await Product.findById(item.productId);

    if (!productItem) {
      throw new NotFoundError("Product not found");
    }

    if (productItem.countInStock < item.qty) {
      throw new BadRequestError("No available quantity");
    }
  }
};

//@desc    create order
//@api     POST /api/order
//@access  private
router.post(
  "/api/orders/create",
  requireAuth,
  orderValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    await validateOrderItems(orderItems);

    const {
      itemsPrice,
      taxPrice,
      shippingCharges: shippingPrice,
      totalPrice,
    } = priceCalculator(orderItems);

    // Check for price calculation consistency
    if (
      req.body.itemsPrice !== itemsPrice ||
      req.body.taxPrice !== taxPrice ||
      req.body.shippingPrice !== shippingPrice ||
      req.body.totalPrice !== totalPrice
    ) {
      throw new BadRequestError("Price calculation does not match");
    }

    // Expiration time
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const orderDetail = Order.build({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
    });

    await orderDetail.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: orderDetail.id,
      version: orderDetail.version,
      orderItems: orderDetail.orderItems,
      totalPrice: orderDetail.totalPrice,
      user: orderDetail.user,
      status: orderDetail.status,
      expiresAt: orderDetail.expiresAt.toISOString(),
    });

    res.status(201).send(orderDetail);
  }
);

export { router as createOrderRouter };
