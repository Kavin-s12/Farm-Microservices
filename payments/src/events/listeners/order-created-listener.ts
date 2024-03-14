import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@farmmicro/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/orderModel";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, totalPrice, status, user, version } = data;

    const order = Order.build({
      id,
      totalPrice,
      status,
      user,
      version,
    });

    await order.save();

    msg.ack();
  }
}
