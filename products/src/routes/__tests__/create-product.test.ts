import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("Create a sample product without sigin", async () => {
  return request(app).post("/api/products").send({}).expect(401);
});

it("Create a sample product without admin - Not Authorized", async () => {
  return request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({})
    .expect(401);
});

it("Create a sample product", async () => {
  const response = await request(app)
    .post("/api/products")
    .set("Cookie", global.signin({ isAdmin: true }))
    .send({})
    .expect(201);
  const product = response.body;
  expect(product.name).toEqual("sample name");
  expect(product.description).toEqual("sample description");
  expect(product.category).toEqual("sample category");
  expect(product.brand).toEqual("sample brand");
  expect(product.user).toBeDefined();
});

it("Product created event publisher", async () => {
  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin({ isAdmin: true }))
    .send({})
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
