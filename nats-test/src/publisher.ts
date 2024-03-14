import nats from "node-nats-streaming";
import { OrderCreatedPublisher } from "./events/order-created-publisher";

const client = nats.connect("farm", "abc", {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new OrderCreatedPublisher(client);

  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (error) {
    console.error(error);
  }
});
