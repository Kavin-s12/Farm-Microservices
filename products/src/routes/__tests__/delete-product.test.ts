import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

const createProduct = (user: string[]) => {
  return request(app)
    .post("/api/products")
    .set("Cookie", user)
    .send({})
    .expect(201);
};

it("Product not found", async () => {
  return request(app)
    .delete(`/api/products/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signin({ isAdmin: true }))
    .send()
    .expect(404);
});

it("Delete the product without admin access", async () => {
  return request(app)
    .delete(`/api/products/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});

it("Product found - cannot be deleted by different user", async () => {
  const userOne = global.signin({ isAdmin: true });
  const userTwo = global.signin({ isAdmin: true });

  const { body: createdProduct } = await createProduct(userOne);

  await request(app)
    .delete(`/api/products/${createdProduct.id}`)
    .set("Cookie", userTwo)
    .send()
    .expect(401);
});

it("Product deleted successfully", async () => {
  const userOne = global.signin({ isAdmin: true });
  const { body: createdProduct } = await createProduct(userOne);

  await request(app)
    .delete(`/api/products/${createdProduct.id}`)
    .set("Cookie", userOne)
    .send()
    .expect(204);

  await request(app)
    .delete(`/api/products/${createdProduct.id}`)
    .set("Cookie", userOne)
    .send()
    .expect(404);
});

it("Product deleted event publisher", async () => {
  await createProduct(global.signin({ isAdmin: true }));

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
