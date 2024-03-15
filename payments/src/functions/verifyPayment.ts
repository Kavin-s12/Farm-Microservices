import { BadRequestError, NotFoundError } from "@farmmicro/common";
import { OrderDoc } from "../model/orderModel";
import { razorpay } from "../razorpay";

export async function verifyToken(
  token: string,
  order: OrderDoc
): Promise<void> {
  const verify = await razorpay.payments.fetch(token);
  if (!verify) {
    throw new NotFoundError("Payment Id not found");
  }
  if (verify.status !== "captured") {
    throw new BadRequestError("Payment failed.");
  }

  if (verify.order_id !== order.razorPayOrderId) {
    throw new BadRequestError("Unexpected token Id");
  }
}
