import mongoose from "mongoose";
import { OrderStatus } from "@farmmicro/common";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
  productId: string;
}

export interface ShippingAddress {
  address: string;
  postalCode: number;
  city: string;
  country: string;
}

export interface OrderAttrs {
  user: string | mongoose.Types.ObjectId;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: OrderStatus;
  expiresAt: Date;
}

export interface OrderDoc extends mongoose.Document {
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  version: number;

  status: OrderStatus;
  expiresAt: Date;

  paymentMethod: string;
  paymentResult: {
    id: string;
    status: string;
    email_address: string;
    update_time: string;
  };
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: Date;
  deliveredAt?: Date;
}

export default OrderDoc;
