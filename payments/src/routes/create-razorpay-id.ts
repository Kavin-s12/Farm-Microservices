import { requireAuth, validateRequest } from "@farmmicro/common";
import axios from "axios";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import Razorpay from "razorpay";
import { razorpay } from "../razorpay";

const router = express.Router();

router.post(
  "/api/payments/createId",
  requireAuth,
  [
    body("amount")
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage("Amount must be provided and numeric"),
    body("orderId")
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage("Order ID should not be empty and valid mongoose object ID"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      // Extract amount and orderId from request body
      const { amount, orderId } = req.body;

      const response = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: req.currentUser!.email,
        notes: {
          orderId,
          userId: req.currentUser!.id,
        },
      });

      // Send the order ID back to the client
      res.status(201).send({ orderId: response.id });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);

      res.status(500).send({ error });
    }
  }
);

export { router as RazorPayIdRouter };
