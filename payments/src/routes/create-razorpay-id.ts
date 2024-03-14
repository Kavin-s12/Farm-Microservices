import { requireAuth, validateRequest } from "@farmmicro/common";
import axios from "axios";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import Razorpay from "razorpay";

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

      const response = await axios.post(
        "https://api.razorpay.com/v1/orders",
        {
          amount: amount * 100, // Amount should be in smallest currency unit (e.g., paise for INR)
          currency: "INR",
          receipt: req.currentUser!.email,
        },
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID!, // Ensure these environment variables are set
            password: process.env.RAZORPAY_SECRET!,
          },
        }
      );

      // Send the order ID back to the client
      res.status(201).send({ orderId: response });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).send({ error: "Failed to create Razorpay order" });
    }
  }
);

export { router as RazorPayIdRouter };
