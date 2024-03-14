import request from "supertest";
import { app } from "../../app";
import { OrderTest } from "../../test/setup";

const createOrder = async (cookie: string[], inputData: OrderTest) => {
  return request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send(inputData);
};

// Delivery
it("Update order delivery status - Not Authorized", async () => {
  const cookie = global.signup();
  const inputData = await testData();
  const { body: order } = await createOrder(cookie, inputData);

  await request(app).put(`/api/orders/${order.id}/delivered`).expect(401);
});

it("Update order delivery status - without admin", async () => {
  const cookie = global.signup();
  const inputData = await testData();
  const { body: order } = await createOrder(cookie, inputData);

  await request(app)
    .put(`/api/orders/${order.id}/delivered`)
    .set("Cookie", cookie)
    .expect(401);
});

it("Update order delivery status", async () => {
  const cookie = global.signup(true);
  const inputData = await testData();
  const { body: order } = await createOrder(cookie, inputData);

  await request(app)
    .put(`/api/orders/${order.id}/delivered`)
    .set("Cookie", cookie)
    .expect(200);
});

//Pay
it("Update order pay status - Not Authorized", async () => {
  const cookie = global.signup();
  const inputData = await testData();
  const { body: order } = await createOrder(cookie, inputData);

  await request(app).put(`/api/orders/${order.id}/pay`).expect(401);
});

it("Update order pay status", async () => {
  const cookie = global.signup();
  const inputData = await testData();
  const { body: order } = await createOrder(cookie, inputData);

  await request(app)
    .put(`/api/orders/${order.id}/pay`)
    .set("Cookie", cookie)
    .expect(200);
});
