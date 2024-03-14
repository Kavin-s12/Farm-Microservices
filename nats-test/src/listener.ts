import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { OrderCreatedListerner } from "./events/order-created-listerner";

const stan = nats.connect("farm", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener conected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new OrderCreatedListerner(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
